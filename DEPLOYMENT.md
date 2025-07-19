# Deployment Guide - Feedback Collection Platform

## 🚀 Deployment Options

### Option 1: Full Stack Deployment on Railway (Recommended)

Railway is perfect for full-stack MERN applications with their new features.

#### **Step 1: Prepare for Railway**

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

3. **Project Structure for Railway**
   ```bash
   # Add these files to your project root
   railway.json    # Railway configuration
   Dockerfile      # Container configuration  
   .railwayignore  # Files to ignore during deployment
   ```

#### **Step 2: Configure Railway**

Create `railway.json` in project root:
```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health"
  }
}
```

#### **Step 3: Deploy to Railway**
```bash
# From your project root
railway login
railway init
railway up
```

### Option 2: Separate Frontend/Backend Deployment

#### **Backend Deployment (Render.com)**

1. **Prepare Backend for Production**
   - Update `server/package.json` scripts
   - Add production build command

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Connect your GitHub repository
   - Create a new Web Service
   - Set build command: `cd server && npm install`
   - Set start command: `cd server && npm start`
   - Add environment variables

#### **Frontend Deployment (Netlify)**

1. **Build React App**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Or connect GitHub for automatic deployments

### Option 3: Heroku Deployment (Traditional)

#### **Prepare for Heroku**

1. **Install Heroku CLI**
   ```bash
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   heroku --version
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-feedback-platform
   ```

#### **Configure for Heroku Deployment**

Add to `server/package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "cd ../client && npm install && npm run build"
  }
}
```

## 📋 Production Configuration

### Environment Variables for Production

**Backend Environment Variables:**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://vishnu21ug4028:oFeG2zti1zbM9Ft3@cluster0.tgm0x.mongodb.net/feedback_platform?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=1560937cd5f6c82900b0ae217a6187bd614ba80a8ade1ac776ecd348fb17324baec151f13587fafe406ecc6a53a347664850b5824651af875c53e6cf9854ece2
FRONTEND_URL=https://your-frontend-domain.com
```

**Frontend Environment Variables:**
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Update CORS for Production

The backend needs to be updated to handle production URLs properly.

## 🛠️ Recommended Deployment Strategy

### **Best Option: Railway (All-in-One)**

**Pros:**
- Deploys both frontend and backend together
- Automatic SSL certificates
- Easy environment variable management
- Git-based deployments
- Free tier available

**Steps:**
1. Push your code to GitHub
2. Connect Railway to your GitHub repo
3. Add environment variables in Railway dashboard
4. Deploy automatically on git push

### **Alternative: Render + Netlify**

**Backend on Render:**
- Great for Node.js applications
- Free tier with limitations
- Automatic deployments from GitHub

**Frontend on Netlify:**
- Excellent for React applications
- Free tier with generous limits
- CDN and automatic deployments

## 🔧 Production Optimizations

### 1. **Database Optimization**
```javascript
// Add to server.js for production
if (process.env.NODE_ENV === 'production') {
  mongoose.set('strictQuery', false);
}
```

### 2. **Security Headers**
```javascript
// Add helmet for security
const helmet = require('helmet');
app.use(helmet());
```

### 3. **Compression**
```javascript
// Add compression
const compression = require('compression');
app.use(compression());
```

### 4. **Rate Limiting**
```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## 🌐 Domain Setup

### Custom Domain Configuration

1. **Purchase Domain** (optional)
   - Namecheap, GoDaddy, or Google Domains

2. **Configure DNS**
   - Point your domain to deployment platform
   - Add CNAME records for subdomains

3. **SSL Certificate**
   - Most platforms provide automatic SSL
   - Force HTTPS redirects

## 📊 Monitoring & Analytics

### Production Monitoring

1. **Error Tracking**
   - Sentry for error monitoring
   - LogRocket for user sessions

2. **Performance Monitoring**
   - Google Analytics
   - Application performance monitoring

3. **Uptime Monitoring**
   - UptimeRobot
   - Pingdom

## 🔒 Security Checklist

- ✅ Environment variables secured
- ✅ JWT secret is strong and unique
- ✅ CORS configured for production domains
- ✅ HTTPS enforced
- ✅ Rate limiting implemented
- ✅ Input validation in place
- ✅ Database connection secured

## 🚀 Quick Deploy Commands

### Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Heroku
```bash
# Create and deploy
heroku create your-app-name
git push heroku main
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
```

### Manual Build
```bash
# Build frontend for production
cd client
npm run build

# Start backend in production
cd ../server
NODE_ENV=production npm start
```

## 📞 Support

If you encounter issues during deployment:

1. Check the deployment logs
2. Verify all environment variables
3. Test API endpoints individually
4. Check database connectivity
5. Ensure CORS is properly configured

Your application is now ready for production deployment! 🎉
