#!/bin/bash

echo "Running Vercel deployment for Unix-based systems..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Vercel CLI not found. Installing..."
  npm install -g vercel
fi

echo "Setting up deployment..."

# Ensure we're logged in
if ! vercel whoami &> /dev/null; then
  echo "Please login to Vercel:"
  vercel login
fi

# Check if we're in the right directory
if [ ! -d "api" ]; then
  echo "Error: api directory not found. Please run this script from the project root."
  exit 1
fi

if [ ! -f "vercel.json" ]; then
  echo "Error: vercel.json not found. Please ensure configuration is set up."
  exit 1
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

echo "Deployment complete!" 