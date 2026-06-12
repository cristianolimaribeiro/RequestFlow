import db from '../database/connection';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';

export class AuthService {
  async login(email: string, password: string) {
    const { rows } = await db.query('SELECT * FROM rf_users WHERE email = $1 AND active = true', [email]);
    const user = rows[0];

    if (!user || !(await comparePassword(password, user.password_hash))) {
      throw { status: 401, message: 'Credenciais inválidas' };
    }

    const token = generateToken({ id: user.id, email: user.email, role: user.role });
    
    const { password_hash, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getMe(id: number) {
    const { rows } = await db.query('SELECT id, name, email, role, active FROM rf_users WHERE id = $1', [id]);
    if (!rows[0]) throw { status: 404, message: 'Usuário não encontrado' };
    return rows[0];
  }
}
