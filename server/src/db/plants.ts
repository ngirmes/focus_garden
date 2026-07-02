import { query } from './index';

export interface Plant {
  id: number;
  user_id: number;
  stage: number;
  points: number;
  created_at: Date;
  sold_at: Date | null;
}

export async function getActivePlant(userId: number): Promise<Plant | undefined> {
  const result = await query<Plant>(
    'SELECT * FROM plants WHERE user_id = $1 AND sold_at IS NULL ORDER BY created_at DESC LIMIT 1',
    [userId]
  );
  return result.rows[0];
}

export async function createPlant(userId: number): Promise<Plant> {
  const result = await query<Plant>(
    'INSERT INTO plants (user_id) VALUES ($1) RETURNING *',
    [userId]
  );
  return result.rows[0];
}

export async function updatePlant(
  plantId: number,
  fields: { stage?: number; points?: number; sold_at?: Date }
): Promise<Plant> {
  const sets: string[] = [];
  const values: unknown[] = [];
  let i = 1;

  if (fields.stage !== undefined)   { sets.push(`stage = $${i++}`);   values.push(fields.stage); }
  if (fields.points !== undefined)  { sets.push(`points = $${i++}`);  values.push(fields.points); }
  if (fields.sold_at !== undefined) { sets.push(`sold_at = $${i++}`); values.push(fields.sold_at); }

  values.push(plantId);
  const result = await query<Plant>(
    `UPDATE plants SET ${sets.join(', ')} WHERE id = $${i} RETURNING *`,
    values
  );
  return result.rows[0];
}
