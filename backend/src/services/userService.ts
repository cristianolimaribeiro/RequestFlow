import db from '../database/connection';
import { hashPassword } from '../utils/password';

export class UserService {
  async listAll() {
    const { rows } = await db.query('SELECT id, name, email, role, active, created_at FROM rf_users ORDER BY name ASC');
    return rows;
  }

  async create(data: any) {
    const hashed = await hashPassword(data.password);
    const { rows } = await db.query(
      'INSERT INTO rf_users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, active',
      [data.name, data.email, hashed, data.role]
    );
    return rows[0];
  }

  async update(id: number, data: any) {
    const { rows } = await db.query(
      'UPDATE rf_users SET name = $1, email = $2, role = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role, active',
      [data.name, data.email, data.role, id]
    );
    return rows[0];
  }

  async toggleActive(id: number) {
    const { rows } = await db.query(
      'UPDATE rf_users SET active = NOT active, updated_at = NOW() WHERE id = $1 RETURNING id, active',
      [id]
    );
    return rows[0];
  }
}
