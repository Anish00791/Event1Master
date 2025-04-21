import dotenv from 'dotenv';
import path from 'path';
import * as schema from '../shared/schema';
import { DbStorage } from './db-storage';

// Load environment variables
dotenv.config();

// Import MySQL database instance - we're using MySQL exclusively
import { db as mysqlDb, runMigrations as runMySqlMigrations } from './db/mysql';

// Use MySQL database instance
export const db = mysqlDb;

// Use database storage for operations with MySQL
export const storage = new DbStorage();

// Run MySQL migrations
export async function runMigrations() {
  try {
    await runMySqlMigrations();
    console.log('MySQL database migrations completed successfully');
  } catch (error) {
    console.error('Error running MySQL database migrations:', error);
    throw error;
  }
} 