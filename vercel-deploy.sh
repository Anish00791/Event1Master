#!/bin/bash
# Vercel deployment script for EventMaster

# Make sure we're in the project directory
if [ ! -f "package.json" ]; then
  echo "Error: Must be run from project root directory"
  exit 1
fi

# Check for Vercel CLI
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Installing globally..."
  npm install -g vercel
fi

# Generate environment file for production
echo "Generating environment variables for Vercel..."
node scripts/generate-vercel-env.js > .env.production
if [ $? -ne 0 ]; then
  echo "Error generating environment file"
  exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Build the project
echo "Building the project..."
npm run build

# Deploy to Vercel using environment variables
echo "Deploying to Vercel..."
vercel --env-file=.env.production --confirm

echo "Deployment complete!"
echo "Note: Make sure you have configured a MySQL database for production."
echo "Vercel does not provide MySQL, so you need to use a service like PlanetScale,"
echo "Amazon RDS, or another MySQL provider and update your DATABASE_URL accordingly." 