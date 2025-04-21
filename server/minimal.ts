import express from "express";
import cors from 'cors';
import { runMigrations } from "./db";

// Create Express app
const app = express();
app.use(express.json());
app.use(cors());

// Simple middleware to log API requests
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.path}`);
  next();
});

// Run the server
async function startServer() {
  try {
    // Initialize database
    await runMigrations();
    console.log('Database is ready');
    
    // API endpoints
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", database: "mysql" });
    });
    
    app.get("/api/events", (req, res) => {
      res.json({ message: "Events endpoint - Replace with actual implementation" });
    });
    
    // Home page
    app.get("/", (req, res) => {
      res.send(`
        <html>
          <head>
            <title>Event Master API</title>
            <style>
              body { font-family: Arial; margin: 40px; line-height: 1.6; }
              h1 { color: #333; }
              .container { max-width: 800px; margin: 0 auto; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Event Master API</h1>
              <p>API server is running with MySQL database.</p>
              <p>Available endpoints:</p>
              <ul>
                <li><a href="/api/health">/api/health</a> - Check server health</li>
                <li><a href="/api/events">/api/events</a> - Get events</li>
              </ul>
            </div>
          </body>
        </html>
      `);
    });
    
    // Start listening
    const PORT = 5000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server failed to start:', error);
  }
}

startServer(); 