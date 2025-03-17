import jwt from 'jsonwebtoken';

// JWT secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'development-jwt-secret';

// In-memory storage for demo
const teams = new Map();
const teamMembers = new Map();
const events = new Map();
const users = new Map();

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

// Add a demo team
teams.set(1, {
  id: 1,
  name: "Code Wizards",
  eventId: 1,
  leaderId: 1
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
  
  // Create a team
  if (req.method === 'POST' && req.url === '/api/teams') {
    // Verify authentication
    const user = authenticate(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      const { name, eventId } = req.body;
      
      // Validate input
      if (!name || !eventId) {
        return res.status(400).json({ message: 'Team name and event ID are required' });
      }
      
      // Check if event exists
      const event = events.get(Number(eventId));
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user is already in a team for this event
      const userTeams = Array.from(teamMembers.values())
        .filter(member => member.userId === user.id)
        .map(member => member.teamId);
      
      const existingTeamForEvent = Array.from(teams.values())
        .filter(team => team.eventId === Number(eventId) && userTeams.includes(team.id));
        
      if (existingTeamForEvent.length > 0) {
        return res.status(400).json({ message: 'You are already in a team for this event' });
      }
      
      // Generate ID
      const id = teams.size + 1;
      
      // Create team
      const newTeam = {
        id,
        name,
        eventId: Number(eventId),
        leaderId: user.id
      };
      
      // Store team
      teams.set(id, newTeam);
      
      // Add creator as team member
      const memberId = teamMembers.size + 1;
      teamMembers.set(memberId, {
        id: memberId,
        teamId: id,
        userId: user.id,
        role: 'leader'
      });
      
      return res.status(201).json(newTeam);
    } catch (error) {
      console.error('Error creating team:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Join a team
  if (req.method === 'POST' && req.url.startsWith('/api/teams/') && req.url.includes('/join')) {
    // Verify authentication
    const user = authenticate(req);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    try {
      // Extract team ID from URL
      const teamId = parseInt(req.url.split('/')[3]);
      
      if (isNaN(teamId)) {
        return res.status(400).json({ message: 'Invalid team ID' });
      }
      
      // Check if team exists
      const team = teams.get(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      // Check if event exists
      const event = events.get(team.eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      
      // Check if user is already in a team for this event
      const userTeams = Array.from(teamMembers.values())
        .filter(member => member.userId === user.id)
        .map(member => member.teamId);
      
      const existingTeamForEvent = Array.from(teams.values())
        .filter(t => t.eventId === team.eventId && userTeams.includes(t.id));
        
      if (existingTeamForEvent.length > 0) {
        return res.status(400).json({ message: 'You are already in a team for this event' });
      }
      
      // Check if team is full
      const teamMemberCount = Array.from(teamMembers.values())
        .filter(member => member.teamId === teamId).length;
        
      if (teamMemberCount >= event.maxTeamSize) {
        return res.status(400).json({ message: 'This team is already full' });
      }
      
      // Add user to team
      const memberId = teamMembers.size + 1;
      teamMembers.set(memberId, {
        id: memberId,
        teamId: teamId,
        userId: user.id,
        role: 'member'
      });
      
      return res.status(200).json({ message: 'Successfully joined team' });
    } catch (error) {
      console.error('Error joining team:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Get team members
  if (req.method === 'GET' && req.url.startsWith('/api/teams/') && req.url.includes('/members')) {
    try {
      // Extract team ID from URL
      const teamId = parseInt(req.url.split('/')[3]);
      
      if (isNaN(teamId)) {
        return res.status(400).json({ message: 'Invalid team ID' });
      }
      
      // Check if team exists
      const team = teams.get(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      
      // Get team members
      const members = Array.from(teamMembers.values())
        .filter(member => member.teamId === teamId);
      
      return res.status(200).json(members);
    } catch (error) {
      console.error('Error fetching team members:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  // Invalid endpoint
  return res.status(404).json({ message: 'Not found' });
} 