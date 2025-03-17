# Event Master

Event Master is a comprehensive platform for managing coding competitions and hackathons.

## Features

- User authentication (organizers and participants)
- Event creation and management
- Team formation and registration
- Event analytics

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express 
- **API**: RESTful API with JWT authentication
- **Deployment**: Vercel

## Development

To run the application in development mode:

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:5000.

## Deployment to Vercel

This application is configured for deployment on Vercel. 

### Automatic Deployment

1. Fork this repository to your GitHub account
2. Sign up for a [Vercel](https://vercel.com) account
3. Create a new project in Vercel and connect it to your GitHub repository
4. Configure the following environment variables in the Vercel dashboard:
   - `JWT_SECRET`: A secret string for JWT token generation
5. Deploy the application

### Manual Deployment

1. Install the Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Run the deployment script:
   ```bash
   ./deploy-vercel.sh
   ```

4. Follow the prompts to deploy

## Project Structure

- `/api` - Serverless API functions for Vercel
- `/client` - React frontend
- `/server` - Server code (used for development)
- `/shared` - Shared types and utilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.