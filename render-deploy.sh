#!/bin/bash
# Render Deployment Script for Feedback Platform
# This script prepares the application for deployment to Render.com
# Run this script from the project root directory

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}    Feedback Platform Render Deployment     ${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git is not installed. Please install git and try again.${NC}"
    exit 1
fi

# Check if we're in the project root
if [ ! -d "./server" ] || [ ! -d "./client" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory.${NC}"
    echo -e "${YELLOW}The script expects to find 'server' and 'client' directories.${NC}"
    exit 1
fi

echo -e "\n${YELLOW}Step 1: Validating project structure...${NC}"
# Check for critical files
if [ ! -f "./server/server.js" ]; then
    echo -e "${RED}Error: server.js not found in the server directory.${NC}"
    exit 1
fi

if [ ! -f "./client/package.json" ]; then
    echo -e "${RED}Error: package.json not found in the client directory.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project structure looks good!${NC}"

echo -e "\n${YELLOW}Step 2: Preparing backend for Render deployment...${NC}"

# Create a render.yaml file if it doesn't exist
if [ ! -f "./render.yaml" ]; then
    echo -e "Creating render.yaml file..."
    cat > "./render.yaml" << EOL
services:
  # Backend API service
  - type: web
    name: feedback-platform-api
    env: node
    rootDir: server
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        sync: false

  # Frontend static site
  - type: web
    name: feedback-platform-frontend
    env: static
    rootDir: client
    buildCommand: npm install && npm run build
    staticPublishPath: ./build
    envVars:
      - key: REACT_APP_API_URL
        fromService:
          type: web
          name: feedback-platform-api
          envVarKey: RENDER_EXTERNAL_URL
EOL
    echo -e "${GREEN}✓ Created render.yaml configuration file${NC}"
else
    echo -e "${YELLOW}render.yaml already exists, skipping creation${NC}"
fi

# Create backend specific files for Render
echo -e "Creating Render-specific files for the backend..."

# Create a .node-version file if it doesn't exist
if [ ! -f "./server/.node-version" ]; then
    echo "18.16.0" > "./server/.node-version"
    echo -e "${GREEN}✓ Created .node-version file${NC}"
else
    echo -e "${YELLOW}.node-version already exists, skipping creation${NC}"
fi

echo -e "\n${YELLOW}Step 3: Preparing frontend for Render deployment...${NC}"

# Update API URL placeholder in the client code
echo -e "Adding API URL configuration to client..."

# Create or update .env.production
echo "REACT_APP_API_URL=\${REACT_APP_API_URL}/api" > "./client/.env.production"
echo -e "${GREEN}✓ Created .env.production with API URL configuration${NC}"

# Ensure the client build script exists and is correct
NODE_BUILD_SCRIPT=$(grep '"build"' ./client/package.json | head -1)
if [[ ! "$NODE_BUILD_SCRIPT" =~ "react-scripts build" ]]; then
    echo -e "${RED}Warning: The build script in client/package.json may not be correctly configured.${NC}"
    echo -e "${YELLOW}It should contain: \"build\": \"react-scripts build\"${NC}"
fi

echo -e "\n${YELLOW}Step 4: Preparing for Git push...${NC}"

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo -e "${YELLOW}Initializing git repository...${NC}"
    git init
    echo -e "${GREEN}✓ Git repository initialized${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

# Create or update .gitignore
if [ ! -f ".gitignore" ]; then
    echo -e "Creating .gitignore file..."
    cat > ".gitignore" << EOL
# dependencies
/node_modules
/client/node_modules
/server/node_modules

# production
/client/build

# misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

npm-debug.log*
yarn-debug.log*
yarn-error.log*
EOL
    echo -e "${GREEN}✓ Created .gitignore file${NC}"
else
    echo -e "${YELLOW}.gitignore already exists, skipping creation${NC}"
fi

echo -e "\n${GREEN}===============================================${NC}"
echo -e "${GREEN}✓ Render deployment preparation complete!${NC}"
echo -e "${GREEN}===============================================${NC}"

echo -e "\n${BLUE}Next steps:${NC}"
echo -e "${YELLOW}1. Create a repository on GitHub if you haven't already${NC}"
echo -e "${YELLOW}2. Run the following commands to push your code:${NC}"
echo -e "   ${BLUE}git add .${NC}"
echo -e "   ${BLUE}git commit -m \"Prepare for Render deployment\"${NC}"
echo -e "   ${BLUE}git remote add origin <YOUR_GITHUB_REPO_URL>${NC}"
echo -e "   ${BLUE}git push -u origin main${NC}"
echo -e "${YELLOW}3. Visit https://dashboard.render.com and sign up/log in${NC}"
echo -e "${YELLOW}4. Select \"Blueprint\" from the dashboard${NC}"
echo -e "${YELLOW}5. Connect your GitHub account and select your repository${NC}"
echo -e "${YELLOW}6. Render will detect the render.yaml file and set up your services${NC}"
echo -e "${YELLOW}7. Add your environment variables in the Render dashboard:${NC}"
echo -e "   ${BLUE}- MONGODB_URI: Your MongoDB connection string${NC}"
echo -e "   ${BLUE}- JWT_SECRET: A secure random string for JWT tokens${NC}"
echo -e "${YELLOW}8. Deploy your services and wait for the build to complete${NC}"
echo -e "${YELLOW}9. Visit your deployed application using the URLs provided by Render${NC}"
