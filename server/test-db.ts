import { db } from './db/mysql';

async function testConnection() {
  try {
    // Try to execute a simple query
    const result = await db.select().from(db.users).limit(1);
    console.log('Database connection successful!');
    console.log('Test query result:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection(); 