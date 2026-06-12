import db from '../database/connection';

export class DashboardService {
  async getStats(user: any) {
    let whereClause = '';
    let params: any[] = [];

    if (user.role === 'requester') {
      whereClause = 'WHERE requester_id = $1';
      params = [user.id];
    }

    const statsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'aberta') as abertas,
        COUNT(*) FILTER (WHERE status = 'em_analise') as em_analise,
        COUNT(*) FILTER (WHERE status = 'aprovada') as aprovadas,
        COUNT(*) FILTER (WHERE status = 'reprovada') as reprovadas,
        COUNT(*) FILTER (WHERE status = 'cancelada') as canceladas,
        COUNT(*) FILTER (WHERE status = 'concluida') as concluidas
      FROM rf_requests
      ${whereClause}
    `;

    const categoryQuery = `
      SELECT c.name, COUNT(r.id) as value
      FROM rf_categories c
      LEFT JOIN rf_requests r ON c.id = r.category_id ${user.role === 'requester' ? 'AND r.requester_id = $1' : ''}
      GROUP BY c.name
    `;

    const priorityQuery = `
      SELECT priority as name, COUNT(*) as value
      FROM rf_requests
      ${whereClause}
      GROUP BY priority
    `;

    const recentQuery = `
      SELECT r.*, c.name as category_name
      FROM rf_requests r
      JOIN rf_categories c ON r.category_id = c.id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT 5
    `;

    const [stats, categories, priorities, recent] = await Promise.all([
      db.query(statsQuery, params),
      db.query(categoryQuery, params),
      db.query(priorityQuery, params),
      db.query(recentQuery, params)
    ]);

    return {
      counters: stats.rows[0],
      byCategory: categories.rows.map(row => ({ ...row, value: Number(row.value) })),
      byPriority: priorities.rows.map(row => ({ ...row, value: Number(row.value) })),
      recent: recent.rows
    };
  }
}
