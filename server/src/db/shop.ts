import { query } from './index';

export interface SeedType {
  id: number;
  name: string;
  price: number;
}

export interface UserSeed {
  id: number;
  name: string;
  quantity: number;
}

export async function getSeedTypes(): Promise<SeedType[]> {
  const result = await query<SeedType>(
    'SELECT id, name, price FROM seed_types ORDER BY price'
  );
  return result.rows;
}

export async function getSeedTypeById(seedTypeId: number): Promise<SeedType | undefined> {
  const result = await query<SeedType>(
    'SELECT id, name, price FROM seed_types WHERE id = $1',
    [seedTypeId]
  );
  return result.rows[0];
}

export async function getUserSeeds(userId: number): Promise<UserSeed[]> {
  const result = await query<UserSeed>(
    `SELECT st.id, st.name, us.quantity
     FROM user_seeds us
     JOIN seed_types st ON st.id = us.seed_type_id
     WHERE us.user_id = $1 AND us.quantity > 0
     ORDER BY st.price`,
    [userId]
  );
  return result.rows;
}
