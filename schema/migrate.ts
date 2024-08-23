import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { connection, db } from '../src/config/database';

// This will run migrations on the database, skipping the ones already applied
await migrate(db, { migrationsFolder: './schema/migration' });

// Don't forget to close the connection, otherwise the script will hang
await connection.end();
