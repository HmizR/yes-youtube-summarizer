const rateLimit = require('express-rate-limit');
const { RateLimiterRedis } = require('rate-limiter-flexible');
const { Summary } = require('../models');
const { Op } = require('sequelize');


// Regular rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  }
});

// Strict rate limiter for sensitive endpoints
exports.strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    success: false,
    error: 'Too many attempts, please try again in an hour'
  }
});

// Summary creation rate limiter (per user) - Sequelize version
exports.summaryLimiter = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (user.role === 'admin') return next();
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Using Sequelize's count() method
    const count = await Summary.count({
      where: {
        user_id: user.id,
        created_at: { 
          [Op.gte]: firstDayOfMonth 
        }
      }
    });
    
    // const limit = user.subscription.monthlyLimit;
    
    // if (count >= limit) {
    //   return res.status(429).json({
    //     success: false,
    //     error: `Monthly limit of ${limit} summaries reached. Upgrade to create more.`
    //   });
    // }
    
    next();
  } catch (error) {
    next(error);
  }
};