import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth';
import { getSeedTypes } from '../db/shop';
import { purchaseSeed } from '../services/shop';

const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seeds = await getSeedTypes();
    return res.json(seeds);
  } catch (err) {
    next(err);
  }
});

const purchaseParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

router.post(
  '/seeds/:id/purchase',
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    const parseResult = purchaseParamsSchema.safeParse(req.params);
    if (!parseResult.success) {
      return res.status(400).json({ error: 'Invalid seed id' });
    }

    try {
      const result = await purchaseSeed(req.user!.userId, parseResult.data.id);
      return res.json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'Not enough coins') {
        return res.status(400).json({ error: err.message });
      }
      if (err instanceof Error && err.message === 'Seed not found') {
        return res.status(404).json({ error: err.message });
      }
      next(err);
    }
  }
);

export default router;
