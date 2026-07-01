import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export function query<T extends import('pg').QueryResultRow = any>(text: string, params?: unknown[]) {
  return pool.query<T>(text, params);
}
