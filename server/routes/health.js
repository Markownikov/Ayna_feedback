const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

/**
 * @route   GET api/health
 * @desc    Health check endpoint for monitoring
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    // Basic health information
    const healthInfo = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: dbStatus
      },
      environment: process.env.NODE_ENV
    };
    
    // Return 200 if everything is OK, otherwise 503
    if (dbStatus === 'connected') {
      return res.status(200).json(healthInfo);
    } else {
      healthInfo.status = 'degraded';
      return res.status(503).json(healthInfo);
    }
  } catch (err) {
    return res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: process.env.NODE_ENV === 'production' ? {} : err
    });
  }
});

module.exports = router;
