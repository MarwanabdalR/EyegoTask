import { Router } from 'express';
import { UserActivityLogController } from '../../controllers/UserActivityLogController';

const router = Router();
const controller = new UserActivityLogController();

router.get('/', controller.getLogs);
router.get('/:id', controller.getLogById);

export default router;
