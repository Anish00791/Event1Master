@echo off
echo Running Vercel deployment for Windows...

:: Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Vercel CLI not found. Installing...
  npm install -g vercel
)

echo Setting up deployment...

:: Ensure we're logged in
vercel whoami >nul 2>nul
if %ERRORLEVEL% neq 0 (
  echo Please login to Vercel:
  vercel login
)

:: Check if we're in the right directory
if not exist "api" (
  echo Error: api directory not found. Please run this script from the project root.
  exit /b 1
)

if not exist "vercel.json" (
  echo Error: vercel.json not found. Please ensure configuration is set up.
  exit /b 1
)

:: Deploy to Vercel
echo Deploying to Vercel...
vercel --prod

echo Deployment complete! 