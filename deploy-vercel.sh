#!/bin/bash

# Color codes for prettier output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Preparing deployment for Vercel${NC}"
echo -e "${GREEN}=========================================${NC}"

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null
then
    echo -e "${YELLOW}Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

# Create a basic .env.production file if it doesn't exist
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}Creating .env.production file...${NC}"
    cat > .env.production << EOL
# JWT Secret for authentication
JWT_SECRET=your_secret_key_here

# Other environment variables for production
NODE_ENV=production
EOL
    echo -e "${GREEN}Created .env.production file. Please update with your actual values.${NC}"
fi

echo -e "${YELLOW}Building for production...${NC}"
npm run build

echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}Deployment preparation complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo -e "${YELLOW}Run the following commands to deploy:${NC}"
echo "1. vercel login (if not already logged in)"
echo "2. vercel"
echo "3. Follow the prompts to deploy"
echo ""
echo -e "${YELLOW}Important Vercel environment variables to set:${NC}"
echo "- JWT_SECRET (required for authentication)"
echo "- Add other environment variables as needed" 