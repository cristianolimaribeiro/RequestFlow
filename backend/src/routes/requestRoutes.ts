import { Router } from 'express';
import multer from 'multer';
import { RequestController } from '../controllers/requestController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { roleMiddleware } from '../middlewares/roleMiddleware';

const router = Router();
const controller = new RequestController();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

router.use(authMiddleware);

router.get('/', roleMiddleware(['admin', 'approver']), controller.listAll);
router.get('/my', controller.listMy);
router.get('/:id', controller.getById);
router.post('/', controller.create);

router.patch('/:id/analyze', roleMiddleware(['admin', 'approver']), controller.analyze);
router.patch('/:id/approve', roleMiddleware(['admin', 'approver']), controller.approve);
router.patch('/:id/reject', roleMiddleware(['admin', 'approver']), controller.reject);
router.patch('/:id/complete', roleMiddleware(['admin', 'approver']), controller.complete);
router.patch('/:id/cancel', controller.cancel);

router.post('/:id/attachments', upload.single('file'), controller.uploadAttachment);
router.get('/:id/attachments/:attachmentId', controller.downloadAttachment);

export default router;
