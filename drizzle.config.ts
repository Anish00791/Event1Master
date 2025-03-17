import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Get database type from environment
const dbType = process.env.DB_TYPE || 'postgres';

// Default configuration
const baseConfig = {
  schema: "./shared/schema.ts",
  out: "./migrations",
};

// Create configuration based on database type
let config;
switch (dbType.toLowerCase()) {
  case 'sqlite':
    config = defineConfig({
      ...baseConfig,
      dialect: "sqlite",
      out: "./migrations/sqlite",
      dbCredentials: {
        url: process.env.SQLITE_PATH || "./data/database.db",
      },
    });
    break;
    
  case 'mysql':
    config = defineConfig({
      ...baseConfig,
      dialect: "mysql",
      out: "./migrations/mysql",
      dbCredentials: {
        host: process.env.MYSQL_HOST || "localhost",
        port: parseInt(process.env.MYSQL_PORT || "3306"),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "event_master",
      },
    });
    break;
    
  case 'postgres':
  default:
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    
    config = defineConfig({
      ...baseConfig,
      dialect: "postgresql",
      out: "./migrations/pg",
      dbCredentials: {
        url: process.env.DATABASE_URL,
      },
    });
    break;
}

export default config;
