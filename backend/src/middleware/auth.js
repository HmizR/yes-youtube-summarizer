// middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../models');
const env = require('../config/env');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, env.JWT_SECRET);
    
    // Get user from database using Sequelize
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authenticated'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// API Key authentication for MySQL
exports.apiKeyAuth = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] || req.query.api_key;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required'
      });
    }
    
    // Verify API key
    const decoded = jwt.verify(apiKey, env.JWT_SECRET);
    
    if (decoded.type !== 'api') {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }
    
    // Get user using Sequelize
    const user = await db.User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }
    
    // Check API key in database
    const apiKeyRecord = await db.ApiKey.findOne({ 
      where: { 
        api_key: apiKey, 
        is_active: true 
      }
    });
    
    if (!apiKeyRecord) {
      return res.status(401).json({
        success: false,
        error: 'API key is not valid'
      });
    }
    
    // Check rate limiting
    const today = new Date().toISOString().split('T')[0];
    let usage = apiKeyRecord.usage;
    if (typeof usage === 'string') {
      usage = JSON.parse(usage);
    }
    
    const todayUsage = usage.find(u => 
      new Date(u.date).toISOString().split('T')[0] === today
    );
    
    if (todayUsage && todayUsage.count >= apiKeyRecord.rate_limit) {
      return res.status(429).json({
        success: false,
        error: 'API rate limit exceeded'
      });
    }
    
    // Update usage
    if (todayUsage) {
      todayUsage.count += 1;
    } else {
      usage.push({ date: new Date(), count: 1 });
    }
    
    await db.ApiKey.update({
      usage: JSON.stringify(usage),
      last_used: new Date()
    }, {
      where: { id: apiKeyRecord.id }
    });
    
    req.user = user;
    req.apiKey = apiKeyRecord;
    next();
  } catch (error) {
    console.error('API key auth error:', error);
    return res.status(401).json({
      success: false,
      error: 'Invalid API key'
    });
  }
};