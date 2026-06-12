import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new DashboardController();

router.use(authMiddleware);
router.get('/', roleMiddleware(['admin', 'approver', 'requester']), controller.getStats);

export default router;
