# Health Check Integration for Render Deployment

This document explains how to integrate the health check endpoint into your Express.js server for optimal monitoring on Render.com.

## Overview

The health check endpoint allows Render to monitor the health of your service and automatically restart it if necessary. This improves reliability and reduces downtime.

## Step 1: Add Health Check Route

The `health.js` route has been created in the `routes` directory. It provides:

- Database connection status
- Server uptime
- Environment information
- Timestamp

## Step 2: Register the Health Route in server.js

Add the following lines to your `server.js` file:

```javascript
// Import health check route
const healthRoutes = require('./routes/health');

// Register routes
app.use('/api/health', healthRoutes);
```

This will make the health check endpoint available at `/api/health`.

## Step 3: Configure Health Check in render.yaml

The health check path is already configured in your `render.yaml` file:

```yaml
services:
  - type: web
    name: feedback-platform-api
    # Other configuration...
    healthCheckPath: /api/health
```

## How Health Checks Work

1. Render will periodically make GET requests to `/api/health`
2. If the endpoint returns:
   - 200 OK: The service is considered healthy
   - 503 Service Unavailable: The service is degraded (database disconnected)
   - Any other status code: The service is considered unhealthy
3. If multiple consecutive health checks fail, Render may restart your service

## Testing Health Checks

To manually test the health check:

```bash
# Using curl
curl https://your-app-name.onrender.com/api/health

# Expected output:
{
  "status": "ok",
  "timestamp": "2023-07-19T12:34:56.789Z",
  "uptime": 1234.56,
  "database": {
    "status": "connected"
  },
  "environment": "production"
}
```

## Customizing Health Checks

You can customize the health check endpoint to include additional checks specific to your application, such as:

- External API dependencies
- Redis connection status
- File system checks
- Memory usage
- Custom application-specific checks

To add more checks, modify the `health.js` file accordingly.
