import { Router, Request, Response, NextFunction } from "express";
import { requireAuth } from "../middleware/auth";
import { getActivePlant, createPlant } from "../db/plants";
import { getCoins } from "../db/users";
import { sellPlant } from "../services/garden";

const router = Router();

router.get(
  "/",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;

      const [plantResult, userResult] = await Promise.all([
        getActivePlant(userId),
        getCoins(userId),
      ]);

      const plant = plantResult ?? (await createPlant(userId));
      const coins = userResult;

      return res.json({ plant, coins });
    } catch (err) {
      next(err);
    }
  },
);

router.post(
  "/sell",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await sellPlant(req.user!.userId);
      return res.json(result);
    } catch (err) {
      if (err instanceof Error && err.message === 'Plant is not ready to sell yet') {
        return res.status(400).json({ error: err.message });
      }
      next(err);
    }
  }
);

export default router;
