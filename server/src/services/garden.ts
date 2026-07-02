import { pool } from '../db/index';
import { getActivePlant } from '../db/plants';
import type { Plant } from '../db/plants';

const MAX_STAGE = 3;
const SELL_REWARD = 50;

export interface SellPlantResult {
  coins: number;
  newPlant: Plant;
}

export async function sellPlant(userId: number): Promise<SellPlantResult> {
  const plant = await getActivePlant(userId);

  if (!plant) throw new Error('No active plant found');
  if (plant.stage < MAX_STAGE) throw new Error('Plant is not ready to sell yet');

  const client = await pool.connect();
  let coins: number;
  let newPlant: Plant;

  try {
    await client.query('BEGIN');

    await client.query(
      'UPDATE plants SET sold_at = now() WHERE id = $1',
      [plant.id]
    );

    const coinsResult = await client.query<{ coins: number }>(
      'UPDATE users SET coins = coins + $1 WHERE id = $2 RETURNING coins',
      [SELL_REWARD, userId]
    );
    coins = coinsResult.rows[0].coins;

    const plantResult = await client.query<Plant>(
      'INSERT INTO plants (user_id) VALUES ($1) RETURNING *',
      [userId]
    );
    newPlant = plantResult.rows[0];

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { coins, newPlant };
}
