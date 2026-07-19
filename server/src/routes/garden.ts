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

      const [plantResult, coins] = await Promise.all([
        getActivePlant(userId),
        getCoins(userId),
      ]);

      // A validly-signed token can still name a user that no longer exists
      // (e.g. the account was deleted after the token was issued). Catch
      // that here rather than letting createPlant's insert fail on the
      // users foreign key below, which would otherwise surface as an
      // opaque 500 instead of telling the client to re-authenticate.
      if (coins === undefined) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const plant = plantResult ?? (await createPlant(userId));

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
