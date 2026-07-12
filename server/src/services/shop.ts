import { pool } from '../db/index';
import { getSeedTypeById } from '../db/shop';

export interface PurchaseSeedResult {
  coins: number;
  quantity: number;
}

export async function purchaseSeed(userId: number, seedTypeId: number): Promise<PurchaseSeedResult> {
  const seedType = await getSeedTypeById(seedTypeId);
  if (!seedType) throw new Error('Seed not found');

  const client = await pool.connect();
  let coins: number;
  let quantity: number;

  try {
    await client.query('BEGIN');

    const userResult = await client.query<{ coins: number }>(
      'SELECT coins FROM users WHERE id = $1 FOR UPDATE',
      [userId]
    );
    const currentCoins = userResult.rows[0].coins;

    if (currentCoins < seedType.price) throw new Error('Not enough coins');

    const coinsResult = await client.query<{ coins: number }>(
      'UPDATE users SET coins = coins - $1 WHERE id = $2 RETURNING coins',
      [seedType.price, userId]
    );
    coins = coinsResult.rows[0].coins;

    const seedResult = await client.query<{ quantity: number }>(
      `INSERT INTO user_seeds (user_id, seed_type_id, quantity)
       VALUES ($1, $2, 1)
       ON CONFLICT (user_id, seed_type_id)
       DO UPDATE SET quantity = user_seeds.quantity + 1
       RETURNING quantity`,
      [userId, seedTypeId]
    );
    quantity = seedResult.rows[0].quantity;

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return { coins, quantity };
}
