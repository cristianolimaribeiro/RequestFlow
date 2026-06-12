import db from '../database/connection';

export class RequestService {
  async listAll() {
    const query = `
      SELECT r.*, c.name as category_name, u.name as requester_name 
      FROM rf_requests r
      JOIN rf_categories c ON r.category_id = c.id
      JOIN rf_users u ON r.requester_id = u.id
      ORDER BY r.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  async listByRequester(requesterId: number) {
    const query = `
      SELECT r.*, c.name as category_name 
      FROM rf_requests r
      JOIN rf_categories c ON r.category_id = c.id
      WHERE r.requester_id = $1
      ORDER BY r.created_at DESC
    `;
    const { rows } = await db.query(query, [requesterId]);
    return rows;
  }

  async getById(id: number) {
    const requestQuery = `
      SELECT r.*, c.name as category_name, u.name as requester_name, a.name as approver_name
      FROM rf_requests r
      JOIN rf_categories c ON r.category_id = c.id
      JOIN rf_users u ON r.requester_id = u.id
      LEFT JOIN rf_users a ON r.approver_id = a.id
      WHERE r.id = $1
    `;
    const historyQuery = `
      SELECT h.*, u.name as user_name 
      FROM rf_request_history h
      JOIN rf_users u ON h.user_id = u.id
      WHERE h.request_id = $1
      ORDER BY h.created_at DESC
    `;
    const attachmentsQuery = `
      SELECT id, file_name, file_type, created_at 
      FROM rf_attachments 
      WHERE request_id = $1
      ORDER BY created_at DESC
    `;
    
    const { rows: requestRows } = await db.query(requestQuery, [id]);
    if (!requestRows[0]) throw { status: 404, message: 'Solicitação não encontrada' };
    
    const { rows: historyRows } = await db.query(historyQuery, [id]);
    const { rows: attachmentRows } = await db.query(attachmentsQuery, [id]);
    
    return { ...requestRows[0], history: historyRows, attachments: attachmentRows };
  }

  async addAttachment(requestId: number, userId: number, file: any) {
    const { rows } = await db.query(
      'INSERT INTO rf_attachments (request_id, user_id, file_name, file_type, file_data) VALUES ($1, $2, $3, $4, $5) RETURNING id, file_name, file_type',
      [requestId, userId, file.originalname, file.mimetype, file.buffer]
    );
    return rows[0];
  }

  async getAttachment(attachmentId: number) {
    const { rows } = await db.query('SELECT * FROM rf_attachments WHERE id = $1', [attachmentId]);
    return rows[0];
  }

  async create(data: any) {
    const { rows } = await db.query(
      'INSERT INTO rf_requests (title, description, category_id, requester_id, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [data.title, data.description, data.category_id, data.requester_id, data.priority]
    );
    
    await this.logHistory(rows[0].id, data.requester_id, 'Criação da solicitação', null, 'aberta');
    return rows[0];
  }

  async updateStatus(id: number, newStatus: string, userId: number, comment?: string) {
    const { rows: current } = await db.query('SELECT status, approver_id FROM rf_requests WHERE id = $1', [id]);
    if (!current[0]) throw { status: 404, message: 'Solicitação não encontrada' };

    const oldStatus = current[0].status;
    let completedAt = null;
    if (newStatus === 'concluida') completedAt = 'NOW()';

    const query = `
      UPDATE rf_requests 
      SET status = $1, approver_id = $2, updated_at = NOW(), completed_at = ${completedAt ? 'NOW()' : 'completed_at'}
      WHERE id = $3 
      RETURNING *
    `;
    
    const { rows } = await db.query(query, [newStatus, userId, id]);
    await this.logHistory(id, userId, `Alteração de status para ${newStatus}`, oldStatus, newStatus, comment);
    
    return rows[0];
  }

  async cancelRequest(id: number, userId: number) {
    const { rows: current } = await db.query('SELECT status, requester_id FROM rf_requests WHERE id = $1', [id]);
    if (!current[0]) throw { status: 404, message: 'Solicitação não encontrada' };
    if (current[0].requester_id !== userId) throw { status: 403, message: 'Apenas o solicitante pode cancelar' };
    if (current[0].status !== 'aberta') throw { status: 400, message: 'Apenas solicitações abertas podem ser canceladas' };

    return this.updateStatus(id, 'cancelada', userId, 'Cancelado pelo solicitante');
  }

  private async logHistory(requestId: number, userId: number, action: string, oldStatus: string | null, newStatus: string, comment?: string) {
    await db.query(
      'INSERT INTO rf_request_history (request_id, user_id, action, old_status, new_status, comment) VALUES ($1, $2, $3, $4, $5, $6)',
      [requestId, userId, action, oldStatus, newStatus, comment]
    );
  }
}
