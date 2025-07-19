@echo off
echo 🚀 Setting up Feedback Collection Platform...

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo 📦 Installing dependencies...

:: Install root dependencies
call npm install

:: Install server dependencies
cd server
call npm install
cd ..

:: Install client dependencies
cd client
call npm install
cd ..

echo ✅ Dependencies installed successfully!
echo.
echo 🔧 Setup Instructions:
echo 1. Make sure MongoDB is running locally or update MONGODB_URI in server\.env
echo 2. Update JWT_SECRET in server\.env to a secure random string
echo 3. Run 'npm run dev' from the root directory to start both server and client
echo.
echo 📚 Available Commands:
echo   npm run dev      - Start both server and client in development mode
echo   npm run server   - Start only the server
echo   npm run client   - Start only the client
echo   npm run build    - Build the client for production
echo.
echo 🌐 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo ✨ Happy coding!
pause
