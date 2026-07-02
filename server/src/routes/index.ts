import { Router } from 'express';
import authRouter from './auth';
import gardenRouter from './garden';
import sessionsRouter from './sessions';

const router = Router();

router.use('/auth', authRouter);
router.use('/garden', gardenRouter);
router.use('/sessions', sessionsRouter);

export default router;
