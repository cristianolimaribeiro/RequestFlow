import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/categoryService';

export class CategoryController {
  private service = new CategoryService();

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.service.listAll();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, description } = req.body;
      if (!name) throw { status: 400, message: 'Nome da categoria é obrigatório' };
      
      const category = await this.service.create({ name, description });
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.update(parseInt(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      next(error);
    }
  };

  toggleActive = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.service.toggleActive(parseInt(req.params.id));
      res.json(category);
    } catch (error) {
      next(error);
    }
  };
}
