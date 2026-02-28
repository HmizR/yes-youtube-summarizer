// controllers/authController.js
const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const env = require('../config/env');
const { Op } = require('sequelize');

// Generate token
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();
  
  const options = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    });
};

// Register user
exports.register = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { username, email, password } = req.body;

    // Check if user exists using Sequelize findOne
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [
          { email: email },
          { username: username }
        ]
      },
      transaction: t
    });

    if (existingUser) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email or username'
      });
    }

    // Create user with Sequelize
    const user = await db.User.create({
      username,
      email,
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`
    }, { transaction: t });

    // Generate API key
    const apiKey = user.generateApiKey();
    await user.save({ transaction: t });

    // Create API key record
    await db.ApiKey.create({
      user_id: user.id,
      api_key: apiKey,
      name: 'Default',
      rate_limit: 100,
      is_active: true
    }, { transaction: t });

    await t.commit();

    sendTokenResponse(user, 201, res);
  } catch (error) {
    await t.rollback();
    console.error('Registration error:', error);
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email or username'
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    // Check for user with Sequelize findOne
    const user = await db.User.findOne({
      where: { email: email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// Logout user
exports.logout = (req, res) => {
  // res.cookie('token', 'none', {
  //   expires: new Date(Date.now() + 10 * 1000),
  //   httpOnly: true
  // });
  // res.clearCookie('token', { // ← Use clearCookie
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   path: '/',
  //   // sameSite: 'strict'
  // });
  // res.cookie('token', '', {
  //   expires: new Date(Date.now() - 1000), // Past date
  //   maxAge: -1, // Negative maxAge
  //   httpOnly: true,
  //   secure: process.env.NODE_ENV === 'production',
  //   sameSite: 'strict',
  //   path: '/'
  // });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };
  
  res.clearCookie('token', cookieOptions);

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    // req.user should be set by auth middleware
    const user = await db.User.findByPk(req.user.id, {
      attributes: { 
        exclude: ['password', 'reset_password_token', 'reset_password_expire'] 
      }
    });

    console.log('Get me user:', user);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate monthly usage for the response
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const monthlyUsage = await db.Summary.count({
      where: {
        user_id: req.user.id,
        created_at: {
          [Op.gte]: firstDayOfMonth
        }
      }
    });

    // Add usage data to the response
    const userData = user.toJSON();
    userData.used_this_month = monthlyUsage;
    userData.remaining_this_month = Math.max(0, user.monthly_limit - monthlyUsage);

    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { username, email, avatar, preferred_ai_model, default_summary_length } = req.body;
    
    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const whereCondition = {
        id: { [db.Sequelize.Op.ne]: req.user.id }
      };
      
      if (username) whereCondition.username = username;
      if (email) whereCondition.email = email;
      
      const existingUser = await db.User.findOne({
        where: whereCondition,
        transaction: t
      });
      
      if (existingUser) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          error: existingUser.username === username ? 
            'Username already exists' : 'Email already exists'
        });
      }
    }

    // Update user
    await db.User.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(avatar && { avatar }),
      ...(preferred_ai_model && { preferred_ai_model }),
      ...(default_summary_length && { default_summary_length })
    }, {
      where: { id: req.user.id },
      transaction: t,
      individualHooks: true // This ensures password hooks run
    });

    await t.commit();
    
    const user = await db.User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    await t.rollback();
    console.error('Update profile error:', error);
    
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }
    
    res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
};