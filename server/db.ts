import dotenv from 'dotenv';
import path from 'path';
import * as schema from '../shared/schema';
import { MemStorage } from './storage';

// Load environment variables
dotenv.config();

// We'll use in-memory storage for simplicity
export const db = {};

// Use memory storage for the database operations
export const storage = new MemStorage();

// No migrations needed for in-memory storage
export async function runMigrations() {
  console.log('Using in-memory storage, no migrations needed');
  return Promise.resolve();
} 