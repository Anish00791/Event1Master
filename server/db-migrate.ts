import { runMigrations } from './db';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Run migrations
async function migrate() {
  try {
    console.log('Starting database migrations...');
    await runMigrations();
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

migrate(); 