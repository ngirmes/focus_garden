import { Router } from 'express';
import authRouter from './auth';
import gardenRouter from './garden';
import sessionsRouter from './sessions';
import shopRouter from './shop';
import inventoryRouter from './inventory';
import tasksRouter from './tasks';

const router = Router();

router.use('/auth', authRouter);
router.use('/garden', gardenRouter);
router.use('/sessions', sessionsRouter);
router.use('/shop', shopRouter);
router.use('/inventory', inventoryRouter);
router.use('/tasks', tasksRouter);

export default router;
