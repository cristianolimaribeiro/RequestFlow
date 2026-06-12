import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new CategoryController();

router.use(authMiddleware);

router.get('/', controller.list);
router.post('/', roleMiddleware(['admin']), controller.create);
router.put('/:id', roleMiddleware(['admin']), controller.update);
router.patch('/:id/toggle-active', roleMiddleware(['admin']), controller.toggleActive);

export default router;
