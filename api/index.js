export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Event Management API',
      version: '1.0.0',
      endpoints: [
        '/api/auth/login',
        '/api/auth/register',
        '/api/events',
        '/api/events/:id/teams',
        '/api/teams',
        '/api/teams/:id/join',
        '/api/teams/:id/members'
      ]
    });
  }
  
  return res.status(405).json({ message: 'Method not allowed' });
} 