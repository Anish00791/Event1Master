import { db } from './db/mysql';

async function testConnection() {
  try {
    // Test the connection by executing a simple query
    const result = await db.execute('SELECT 1 as test');
    console.log('Database connection successful!');
    console.log('Test query result:', result);
  } catch (error) {
    console.error('Database connection failed:', error);
  } finally {
    // Close the connection pool
    process.exit(0);
  }
}

testConnection(); 