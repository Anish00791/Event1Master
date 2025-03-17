import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as schema from '../../shared/schema';
import path from 'path';

// PostgreSQL connection
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create clients for queries and migrations
const migrationClient = postgres(connectionString, { max: 1 });
const queryClient = postgres(connectionString);

// Create database instance
export const db = drizzle(queryClient, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running PostgreSQL migrations...');
    await migrate(drizzle(migrationClient), {
      migrationsFolder: path.resolve(__dirname, '../../migrations/pg'),
    });
    console.log('PostgreSQL migrations completed successfully');
  } catch (error) {
    console.error('Error running PostgreSQL migrations:', error);
    throw error;
  }
} 