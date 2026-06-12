import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private service = new AuthService();

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw { status: 400, message: 'Email e senha obrigatórios' };
      
      const result = await this.service.login(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: any, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.getMe(req.user.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
