@echo off
:: Vercel deployment script for EventMaster (Windows)

:: Make sure we're in the project directory
if not exist "package.json" (
  echo Error: Must be run from project root directory
  exit /b 1
)

:: Check for Vercel CLI
where vercel >nul 2>&1
if %ERRORLEVEL% neq 0 (
  echo Vercel CLI not found. Installing globally...
  call npm install -g vercel
)

:: Generate environment file for production
echo Generating environment variables for Vercel...
node scripts/generate-vercel-env.js > .env.production
if %ERRORLEVEL% neq 0 (
  echo Error generating environment file
  exit /b 1
)

:: Install dependencies if needed
if not exist "node_modules\" (
  echo Installing dependencies...
  call npm install
)

:: Build the project
echo Building the project...
call npm run build

:: Deploy to Vercel using environment variables
echo Deploying to Vercel...
call vercel --env-file=.env.production --confirm

echo Deployment complete!
echo Note: Make sure you have configured a MySQL database for production.
echo Vercel does not provide MySQL, so you need to use a service like PlanetScale,
echo Amazon RDS, or another MySQL provider and update your DATABASE_URL accordingly. 