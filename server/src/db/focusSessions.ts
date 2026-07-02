import { query } from './index';

export interface FocusSession {
  id: number;
  user_id: number;
  plant_id: number;
  duration_minutes: number;
  points_earned: number;
  completed_at: Date;
}

export async function createFocusSession(
  userId: number,
  plantId: number,
  durationMinutes: number,
  pointsEarned: number
): Promise<FocusSession> {
  const result = await query<FocusSession>(
    `INSERT INTO focus_sessions (user_id, plant_id, duration_minutes, points_earned)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [userId, plantId, durationMinutes, pointsEarned]
  );
  return result.rows[0];
}
