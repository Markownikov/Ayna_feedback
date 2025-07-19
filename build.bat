@echo off
echo 🔧 Starting build process...

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install
cd ..

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

REM Build React app
echo 🏗️ Building React application...
cd client
call npm run build
cd ..

echo ✅ Build complete!
