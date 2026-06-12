import { Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboardService';

export class DashboardController {
  private service = new DashboardService();

  getStats = async (req: any, res: Response, next: NextFunction) => {
    try {
      const stats = await this.service.getStats(req.user);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  };
}
