import { pool } from '../db/index';
import { getActivePlant } from '../db/plants';
import type { Plant } from '../db/plants';

// Points needed to reach each stage. Index = stage number being entered.
// e.g. THRESHOLDS[1] = 20 means you need 20 cumulative points to reach stage 1.
const THRESHOLDS = [0, 20, 65, 150] as const;
const MAX_STAGE = 3;

export function pointsForSession(minutes: number): number {
  // Rewards longer sessions without heavily penalising short ones.
  // 5 min → 5 pts | 15 min → 18 pts | 25 min → 35 pts | 60 min → 106 pts
  return Math.round(minutes * Math.sqrt(minutes / 5));
}

function stageForPoints(points: number): number {
  let stage = 0;
  for (let i = 1; i <= MAX_STAGE; i++) {
    if (points >= THRESHOLDS[i]) stage = i;
    else break;
  }
  return stage;
}

export interface CompleteSessionResult {
  plant: Plant;
  pointsEarned: number;
  evolved: boolean;
}

export async function completeSession(
  userId: number,
  durationMinutes: number
): Promise<CompleteSessionResult> {
  const plant = await getActivePlant(userId);
  if (!plant) throw new Error('No active plant found');

  const pointsEarned = pointsForSession(durationMinutes);
  const newPoints = plant.points + pointsEarned;
  const newStage = stageForPoints(newPoints);
  const evolved = newStage > plant.stage;

  // Write both records together so neither persists without the other.
  const client = await pool.connect();
  let updatedPlant: Plant;
  try {
    await client.query('BEGIN');

    await client.query(
      `INSERT INTO focus_sessions (user_id, plant_id, duration_minutes, points_earned)
       VALUES ($1, $2, $3, $4)`,
      [userId, plant.id, durationMinutes, pointsEarned]
    );

    const result = await client.query<Plant>(
      'UPDATE plants SET points = $1, stage = $2 WHERE id = $3 RETURNING *',
      [newPoints, newStage, plant.id]
    );
    updatedPlant = result.rows[0];

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { plant: updatedPlant, pointsEarned, evolved };
}
