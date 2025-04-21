import { db } from './db/mysql';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the correct path
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Make sure the DATABASE_URL is set
process.env.DATABASE_URL = "mysql://root:9934178054Am@localhost:3306/eventmaster";

async function testDatabaseOperations() {
  try {
    // Create a test user
    const newUser = await db.insert(users).values({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('Created test user:', newUser);

    // Query the user back
    const result = await db.select().from(users).where(eq(users.username, 'testuser'));
    console.log('Query result:', result);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

testDatabaseOperations(); 