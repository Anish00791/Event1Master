import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '../../shared/schema';
import path from 'path';
import fs from 'fs';

// Use in-memory SQLite for simplicity
const dbClient = createClient({
  url: 'file:local.db',
});

// Create database instance
export const db = drizzle(dbClient, { schema });

// Function to run migrations
export async function runMigrations() {
  try {
    console.log('Running in-memory SQLite setup...');
    
    // Creating tables directly with SQL
    // Users table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        role TEXT NOT NULL
      )
    `);
    
    // Events table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        max_team_size INTEGER NOT NULL,
        creator_id INTEGER NOT NULL
      )
    `);
    
    // Teams table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        event_id INTEGER NOT NULL,
        leader_id INTEGER NOT NULL
      )
    `);
    
    // Team members table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        team_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL
      )
    `);
    
    // Registrations table
    await dbClient.execute(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        team_id INTEGER,
        status TEXT NOT NULL
      )
    `);
    
    console.log('SQLite tables created successfully');
  } catch (error) {
    console.error('Error creating SQLite tables:', error);
    throw error;
  }
} 