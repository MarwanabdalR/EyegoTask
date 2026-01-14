import { Router } from 'express';
import { UserActivityLogController } from '../../controllers/UserActivityLogController';

const router = Router();
const controller = new UserActivityLogController();

router.post('/', controller.publishLog);

export default router;
