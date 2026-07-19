import { query } from "./index";

export interface User {
  id: number;
  email: string;
  password_hash: string;
  created_at: Date;
}

export async function findUserByEmail(
  email: string,
): Promise<User | undefined> {
  const result = await query<User>("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

export async function createUser(
  email: string,
  passwordHash: string,
): Promise<User> {
  const result = await query<User>(
    "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
    [email, passwordHash],
  );
  return result.rows[0];
}

export async function getCoins(userId: number): Promise<number | undefined> {
  const result = await query<{ coins: number }>(
    "SELECT coins FROM users WHERE id = $1",
    [userId],
  );
  return result.rows[0]?.coins;
}
