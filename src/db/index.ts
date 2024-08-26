import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import env from '../config/env';
import * as schema from './schema';

const { Pool } = pg;

const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
export type DB = typeof db;
