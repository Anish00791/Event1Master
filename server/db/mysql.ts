import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as schema from '../../shared/schema';
import path from 'path';

// MySQL connection configuration
const host = process.env.MYSQL_HOST || 'localhost';
const port = parseInt(process.env.MYSQL_PORT || '3306');
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD;
const database = process.env.MYSQL_DATABASE || 'event_master';

if (!password) {
  throw new Error('MYSQL_PASSWORD environment variable is not set');
}

// Create MySQL connection pool
const poolConnection = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
});

// Create database instance
export const db = drizzle(poolConnection, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running MySQL migrations...');
    await migrate(db, {
      migrationsFolder: path.resolve(__dirname, '../../migrations/mysql'),
    });
    console.log('MySQL migrations completed successfully');
  } catch (error) {
    console.error('Error running MySQL migrations:', error);
    throw error;
  }
} 