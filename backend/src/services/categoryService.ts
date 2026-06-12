import db from '../database/connection';

export class CategoryService {
  async listAll() {
    const { rows } = await db.query('SELECT * FROM rf_categories ORDER BY name ASC');
    return rows;
  }

  async create(data: any) {
    const { rows } = await db.query(
      'INSERT INTO rf_categories (name, description) VALUES ($1, $2) RETURNING *',
      [data.name, data.description]
    );
    return rows[0];
  }

  async update(id: number, data: any) {
    const { rows } = await db.query(
      'UPDATE rf_categories SET name = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [data.name, data.description, id]
    );
    return rows[0];
  }

  async toggleActive(id: number) {
    const { rows } = await db.query(
      'UPDATE rf_categories SET active = NOT active, updated_at = NOW() WHERE id = $1 RETURNING id, active',
      [id]
    );
    return rows[0];
  }
}
