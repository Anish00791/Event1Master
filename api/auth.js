import jwt from 'jsonwebtoken';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret';

// In-memory user storage for demo purposes
// In production, you would use a database
const users = new Map();

// Add a demo user
users.set('admin', {
  id: 1,
  username: 'admin',
  password: 'password123',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'organizer'
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle login
  if (req.method === 'POST' && req.url === '/api/auth/login') {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }
      
      const user = users.get(username);
      
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // In a real app, you'd use bcrypt to compare passwords
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      return res.status(200).json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Handle registration
  if (req.method === 'POST' && req.url === '/api/auth/register') {
    try {
      const { username, password, name, email, role } = req.body;
      
      // Validate input
      if (!username || !password || !name || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Check if user already exists
      if (users.has(username)) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      
      // Get next id
      const id = users.size + 1;
      
      // Create new user
      const user = {
        id,
        username, 
        password, // In a real app, hash the password
        name,
        email,
        role
      };
      
      // Store user
      users.set(username, user);
      
      // Create JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username,
          role: user.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      return res.status(201).json({ 
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Invalid endpoint
  return res.status(404).json({ message: 'Not found' });
} 