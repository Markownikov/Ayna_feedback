# 🚀 Deploying the Feedback Platform on Render

This guide provides step-by-step instructions to deploy the Feedback Platform on Render.com, a modern cloud platform that offers both free and paid tiers for web services.

## Overview

We'll deploy the application as two separate services:
1. **Backend API** - Express.js/Node.js server connecting to MongoDB Atlas
2. **Frontend Web Service** - React SPA (Single Page Application)

This separation provides better scalability, easier maintenance, and cleaner architecture.

## Prerequisites

- [Render.com](https://render.com) account (can sign up with GitHub)
- Your MongoDB Atlas connection string
- This codebase pushed to a GitHub repository (for direct deployment)

## Part 1: Deploying the Backend API Service

### Step 1: Prepare your Backend for Deployment

1. Make sure your MongoDB connection string is set up to use environment variables:

```javascript
// server/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
```

2. Ensure your server listens on the port provided by Render:

```javascript
// server/server.js
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

3. Add a `start` script in your backend `package.json`:

```json
"scripts": {
  "start": "node server.js"
}
```

### Step 2: Create a Web Service on Render

1. Log in to your [Render Dashboard](https://dashboard.render.com)
2. Click on the **"New +"** button and select **"Web Service"**
3. Connect your GitHub repository or use the manual deploy option
4. Fill out the deployment form:
   - **Name**: `feedback-platform-api` (or any name you prefer)
   - **Environment**: `Node`
   - **Build Command**: `npm install` 
   - **Start Command**: `npm start`
   - **Root Directory**: `server` (IMPORTANT: Point to your server directory)

5. Under **"Advanced"** settings, add the following environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g., `mongodb+srv://username:password@cluster0.xxx.mongodb.net/feedback_platform`)
   - `JWT_SECRET`: Your secure JWT secret for authentication
   - `NODE_ENV`: `production`

6. Choose a plan (Free plan works for development/testing)
7. Click **"Create Web Service"**

Render will automatically build and deploy your backend API. This process usually takes a few minutes.

## Part 2: Deploying the Frontend as a Static Site

### Step 1: Prepare your Frontend for Production

1. Update your API base URL to point to your Render backend:

Create a `.env` file in your client directory:

```
REACT_APP_API_URL=https://your-render-backend-url.onrender.com/api
```

Replace `your-render-backend-url` with the actual URL of your deployed backend service.

2. Build your React application:

```bash
cd client
npm install
npm run build
```

This generates a `build` directory with static assets ready for deployment.

### Step 2: Create a Static Site on Render

1. From your Render Dashboard, click **"New +"** and select **"Static Site"**
2. Connect your GitHub repository or use the manual deploy option
3. Fill out the deployment form:
   - **Name**: `feedback-platform` (or any name you prefer)
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Environment**: `Static Site`

4. Under **"Advanced"** settings, add environment variables:
   - `REACT_APP_API_URL`: The URL of your deployed backend API

5. Choose a plan (Free plan works for development/testing)
6. Click **"Create Static Site"**

Render will build and deploy your React application. After deployment, you'll get a URL where your frontend is hosted (e.g., `https://feedback-platform.onrender.com`).

## Part 3: Configuring CORS for Cross-Origin Requests

Since your backend and frontend are deployed on different domains, you need to configure CORS on your backend:

1. Make sure your server's CORS configuration accepts requests from your frontend domain:

```javascript
// server/server.js
const cors = require('cors');

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-render-frontend-url.onrender.com',
  credentials: true
}));
```

2. Add the `FRONTEND_URL` environment variable to your backend service on Render:
   - Go to your backend service dashboard
   - Navigate to the "Environment" tab
   - Add `FRONTEND_URL` with the value of your frontend URL

## Part 4: Custom Domain Setup (Optional)

To use a custom domain for your application:

1. Purchase a domain from a domain registrar (like Namecheap, GoDaddy, etc.)
2. In your Render dashboard, select your service
3. Go to the "Settings" tab
4. Under "Custom Domain", click "Add Custom Domain"
5. Follow the instructions to configure DNS records for your domain

## Part 5: Verifying the Deployment

1. Once both services are deployed, visit your frontend URL
2. Test login, form creation, and response collection
3. Check that your backend API is correctly receiving and processing requests

## Troubleshooting

### Common Issues and Solutions

1. **CORS Errors**:
   - Verify CORS configuration in your backend
   - Ensure the frontend URL is correctly set in the environment variables

2. **Database Connection Issues**:
   - Check that your MongoDB Atlas network access allows connections from anywhere (0.0.0.0/0)
   - Verify your connection string is correct and properly URL-encoded

3. **Build Failures**:
   - Check Render logs for specific build errors
   - Ensure all dependencies are properly listed in package.json

4. **API Connection Issues**:
   - Verify the API URL is correctly set in your frontend
   - Check that endpoints are properly configured with the '/api' prefix if needed

### Render Dashboard and Logs

For detailed troubleshooting:

1. Go to your service on the Render dashboard
2. Navigate to the "Logs" tab to see real-time logs
3. Use the "Shell" option to access a terminal directly on your deployment instance

## Part 6: Scaling and Performance (Advanced)

### Upgrading for Production Use

When moving to a production environment with more users:

1. **Upgrade your Render Plan**:
   - Move to a paid plan for better performance and reliability
   - Consider using a dedicated instance for consistent performance

2. **Database Scaling**:
   - Monitor MongoDB Atlas usage and upgrade your cluster as needed
   - Set up proper indexing for better query performance

3. **CDN Integration**:
   - Enable Render's built-in CDN for faster static asset delivery
   - Configure caching policies appropriately

### Monitoring and Performance

1. Set up monitoring using Render's built-in metrics or third-party services like New Relic or Datadog
2. Configure alert notifications for downtime or performance issues

## Conclusion

Your Feedback Platform should now be successfully deployed on Render, with:
- A scalable backend API service
- A fast, CDN-backed frontend application
- Proper separation of concerns for easier maintenance

This deployment approach gives you a professional, production-ready application that can scale as your user base grows.

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Best Practices](https://www.mongodb.com/basics/best-practices)
- [React Deployment Tips](https://create-react-app.dev/docs/deployment/)
