# Render Deployment Script for Feedback Platform (PowerShell Version)
# This script prepares the application for deployment to Render.com
# Run this script from the project root directory

# Define colors for console output
$Green = @{ForegroundColor = 'Green'}
$Yellow = @{ForegroundColor = 'Yellow'}
$Red = @{ForegroundColor = 'Red'}
$Blue = @{ForegroundColor = 'Blue'}

Write-Host "============================================" @Blue
Write-Host "    Feedback Platform Render Deployment     " @Blue
Write-Host "============================================" @Blue

# Check if git is installed
if (-not (Get-Command "git" -ErrorAction SilentlyContinue)) {
    Write-Host "Git is not installed. Please install git and try again." @Red
    exit 1
}

# Check if we're in the project root
if (-not ((Test-Path "./server") -and (Test-Path "./client"))) {
    Write-Host "Error: Please run this script from the project root directory." @Red
    Write-Host "The script expects to find 'server' and 'client' directories." @Yellow
    exit 1
}

Write-Host "`nStep 1: Validating project structure..." @Yellow
# Check for critical files
if (-not (Test-Path "./server/server.js")) {
    Write-Host "Error: server.js not found in the server directory." @Red
    exit 1
}

if (-not (Test-Path "./client/package.json")) {
    Write-Host "Error: package.json not found in the client directory." @Red
    exit 1
}

Write-Host "✓ Project structure looks good!" @Green

Write-Host "`nStep 2: Preparing backend for Render deployment..." @Yellow

# Create a render.yaml file if it doesn't exist
if (-not (Test-Path "./render.yaml")) {
    Write-Host "Creating render.yaml file..."
    @"
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
"@ | Out-File -FilePath "./render.yaml" -Encoding utf8
    Write-Host "✓ Created render.yaml configuration file" @Green
} else {
    Write-Host "render.yaml already exists, skipping creation" @Yellow
}

# Create backend specific files for Render
Write-Host "Creating Render-specific files for the backend..."

# Create a .node-version file if it doesn't exist
if (-not (Test-Path "./server/.node-version")) {
    "18.16.0" | Out-File -FilePath "./server/.node-version" -Encoding utf8 -NoNewline
    Write-Host "✓ Created .node-version file" @Green
} else {
    Write-Host ".node-version already exists, skipping creation" @Yellow
}

Write-Host "`nStep 3: Preparing frontend for Render deployment..." @Yellow

# Update API URL placeholder in the client code
Write-Host "Adding API URL configuration to client..."

# Create or update .env.production
"REACT_APP_API_URL=`${REACT_APP_API_URL}/api" | Out-File -FilePath "./client/.env.production" -Encoding utf8
Write-Host "✓ Created .env.production with API URL configuration" @Green

# Ensure the client build script exists and is correct
$packageJson = Get-Content "./client/package.json" -Raw | ConvertFrom-Json
$buildScript = $packageJson.scripts.build
if (-not $buildScript -or $buildScript -ne "react-scripts build") {
    Write-Host "Warning: The build script in client/package.json may not be correctly configured." @Red
    Write-Host "It should contain: `"build`": `"react-scripts build`"" @Yellow
}

Write-Host "`nStep 4: Preparing for Git push..." @Yellow

# Check if git repo exists
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository..." @Yellow
    git init
    Write-Host "✓ Git repository initialized" @Green
} else {
    Write-Host "✓ Git repository already exists" @Green
}

# Create or update .gitignore
if (-not (Test-Path ".gitignore")) {
    Write-Host "Creating .gitignore file..."
    @"
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
"@ | Out-File -FilePath ".gitignore" -Encoding utf8
    Write-Host "✓ Created .gitignore file" @Green
} else {
    Write-Host ".gitignore already exists, skipping creation" @Yellow
}

Write-Host "`n===============================================" @Green
Write-Host "✓ Render deployment preparation complete!" @Green
Write-Host "===============================================" @Green

Write-Host "`nNext steps:" @Blue
Write-Host "1. Create a repository on GitHub if you haven't already" @Yellow
Write-Host "2. Run the following commands to push your code:" @Yellow
Write-Host "   git add ." @Blue
Write-Host "   git commit -m `"Prepare for Render deployment`"" @Blue
Write-Host "   git remote add origin <YOUR_GITHUB_REPO_URL>" @Blue
Write-Host "   git push -u origin main" @Blue
Write-Host "3. Visit https://dashboard.render.com and sign up/log in" @Yellow
Write-Host "4. Select `"Blueprint`" from the dashboard" @Yellow
Write-Host "5. Connect your GitHub account and select your repository" @Yellow
Write-Host "6. Render will detect the render.yaml file and set up your services" @Yellow
Write-Host "7. Add your environment variables in the Render dashboard:" @Yellow
Write-Host "   - MONGODB_URI: Your MongoDB connection string" @Blue
Write-Host "   - JWT_SECRET: A secure random string for JWT tokens" @Blue
Write-Host "8. Deploy your services and wait for the build to complete" @Yellow
Write-Host "9. Visit your deployed application using the URLs provided by Render" @Yellow
