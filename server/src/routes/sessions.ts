import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { completeSession } from '../services/sessions';

const router = Router();

router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { duration_minutes } = req.body as { duration_minutes?: unknown };

    if (
      typeof duration_minutes !== 'number' ||
      !Number.isInteger(duration_minutes) ||
      duration_minutes < 1 ||
      duration_minutes > 180
    ) {
      return res.status(400).json({ error: 'duration_minutes must be a whole number between 1 and 180' });
    }

    const result = await completeSession(req.user!.userId, duration_minutes);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
