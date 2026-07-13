import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '../middleware/auth';
import { getUserSeeds } from '../db/shop';

const router = Router();

router.get('/seeds', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seeds = await getUserSeeds(req.user!.userId);
    return res.json(seeds);
  } catch (err) {
    next(err);
  }
});

export default router;
