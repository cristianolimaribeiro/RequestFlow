import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';

export class UserController {
  private service = new UserService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.service.listAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) throw { status: 400, message: 'Campos obrigatórios ausentes' };
      
      const user = await this.service.create({ name, email, password, role });
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.update(parseInt(req.params.id), req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  toggleActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.service.toggleActive(parseInt(req.params.id));
      res.json(user);
    } catch (error) {
      next(error);
    }
  };
}
