import { drizzle } from 'drizzle-orm/mysql2';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import mysql from 'mysql2/promise';
import * as schema from '../../shared/schema';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse MySQL connection string from DATABASE_URL
function parseConnectionString(connectionString: string) {
  // Format: mysql://user:password@host:port/database
  try {
    const url = new URL(connectionString);
    return {
      host: url.hostname,
      port: parseInt(url.port || '3306'),
      user: url.username,
      password: url.password,
      database: url.pathname.substring(1), // Remove leading slash
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : undefined
    };
  } catch (error) {
    console.error('Failed to parse DATABASE_URL:', error);
    throw error;
  }
}

// Get MySQL configuration from environment variable
const connectionString = process.env.DATABASE_URL || 'mysql://root:9934178054Am@localhost:3306/eventmaster';
const config = parseConnectionString(connectionString);

// Create MySQL connection pool
const poolConnection = mysql.createPool({
  ...config,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test the connection
async function testConnection() {
  try {
    const connection = await poolConnection.getConnection();
    console.log('Successfully connected to MySQL database');
    connection.release();
  } catch (error) {
    console.error('Failed to connect to MySQL database:', error);
    throw error;
  }
}

// Create database instance
export const db = drizzle(poolConnection, { 
  schema,
  mode: 'default'
});

// Function to run migrations
export async function runMigrations() {
  try {
    // Test connection first
    await testConnection();
    
    // In production (Vercel), we don't run migrations automatically
    if (process.env.NODE_ENV === 'production') {
      console.log('Skipping migrations in production environment');
      return;
    }
    
    const migrationsPath = path.resolve(__dirname, '../../migrations/mysql');
    console.log(`Running MySQL migrations from ${migrationsPath}...`);
    
    await migrate(db, {
      migrationsFolder: migrationsPath,
    });
    console.log('MySQL migrations completed successfully');
  } catch (error) {
    console.error('Error running MySQL migrations:', error);
    throw error;
  }
} 