import jwt from 'jsonwebtoken';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret';

// In-memory storage for demo
const events = new Map();
const teams = new Map();

// Add some demo data
events.set(1, {
  id: 1,
  title: "Hackathon 2025",
  description: "Annual coding competition",
  startDate: "2025-06-01T09:00:00Z",
  endDate: "2025-06-02T18:00:00Z",
  maxTeamSize: 4,
  creatorId: 1
});

// Authentication middleware
const authenticate = (req) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

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
  
  // Get all events
  if (req.method === 'GET' && req.url === '/api/events') {
    try {
      const allEvents = Array.from(events.values());
      return res.status(200).json(allEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Create a new event
  if (req.method === 'POST' && req.url === '/api/events') {
    // Verify authentication
    const user = authenticate(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Only organizers can create events
    if (user.role !== 'organizer') {
      return res.status(403).json({ message: 'Only organizers can create events' });
    }
    
    try {
      const { title, description, startDate, endDate, maxTeamSize } = req.body;
      
      // Validate input
      if (!title || !description || !startDate || !endDate || !maxTeamSize) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      // Generate ID
      const id = events.size + 1;
      
      // Create event
      const newEvent = {
        id,
        title,
        description,
        startDate,
        endDate,
        maxTeamSize: Number(maxTeamSize),
        creatorId: user.id
      };
      
      // Store event
      events.set(id, newEvent);
      
      return res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error creating event:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Get teams for an event
  if (req.method === 'GET' && req.url.startsWith('/api/events/') && req.url.includes('/teams')) {
    try {
      // Extract event ID from URL
      const eventId = parseInt(req.url.split('/')[3]);
      
      if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      
      // Get all teams for this event
      const eventTeams = Array.from(teams.values()).filter(team => team.eventId === eventId);
      
      return res.status(200).json(eventTeams);
    } catch (error) {
      console.error('Error fetching teams:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Invalid endpoint
  return res.status(404).json({ message: 'Not found' });
} 