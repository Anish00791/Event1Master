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

## MySQL Database Configuration

This application uses MySQL as its primary database. Here's how to set it up:

### Local Development

1. Install MySQL locally or use a Docker container
2. Create a database called `eventmaster`
3. Update your `.env` file with the correct credentials:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/eventmaster"
   DB_TYPE="mysql"
   JWT_SECRET="your-secure-jwt-secret-key"
   ```

### Vercel Deployment

When deploying to Vercel, you'll need to set up an external MySQL database, as Vercel doesn't provide MySQL hosting. Good options include:

1. **PlanetScale** - Serverless MySQL platform compatible with Vercel
2. **Amazon RDS** - AWS MySQL database service
3. **Azure Database for MySQL** - Microsoft's MySQL offering
4. **Google Cloud SQL** - Google's MySQL database service

After setting up your database, update the `DATABASE_URL` in your Vercel environment variables to point to your production database.

#### Deploying to Vercel

Run one of the deployment scripts:

```bash
# On Linux/macOS
./vercel-deploy.sh

# On Windows
vercel-deploy.bat
```

The script will:
1. Generate a Vercel-compatible environment file
2. Build the application
3. Deploy to Vercel using your environment variables

#### Important Database Notes for Vercel

1. **Connection Pooling**: Since Vercel uses serverless functions, the database connection is established for each request. Using a connection pooling service like PlanetScale or adding a connection pooler can improve performance.

2. **Migrations**: Database migrations don't run automatically in production. You'll need to run them manually or set up a CI/CD process.

3. **Cold Starts**: Serverless functions can experience cold starts, which might delay the first database connection. Design your application to handle this gracefully.

## Project Structure

- `/api` - Serverless API functions for Vercel
- `/client` - React frontend
- `/server` - Server code (used for development)
- `/shared` - Shared types and utilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.