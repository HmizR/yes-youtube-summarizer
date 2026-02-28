const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

// Environment configuration
const env = {
  // Server Configuration
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  HOST: process.env.HOST || 'localhost',
  
  // MySQL Database Configuration
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT) || 3306,
  DB_NAME: process.env.DB_NAME || 'youtube_summarizer',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_DIALECT: process.env.DB_DIALECT || 'mysql',
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX) || 10,
  DB_POOL_MIN: parseInt(process.env.DB_POOL_MIN) || 0,
  DB_POOL_ACQUIRE: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
  DB_POOL_IDLE: parseInt(process.env.DB_POOL_IDLE) || 10000,
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_this_in_production',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '7d',
  JWT_COOKIE_EXPIRE: parseInt(process.env.JWT_COOKIE_EXPIRE) || 7,
  
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // YouTube API
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || '',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true' || true,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FILE: process.env.LOG_FILE || path.join(__dirname, '../../logs/app.log'),
  
  // Uploads
  UPLOAD_MAX_SIZE: parseInt(process.env.UPLOAD_MAX_SIZE) || 5 * 1024 * 1024, // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
  
  // Session
  SESSION_SECRET: process.env.SESSION_SECRET || 'your_session_secret_key_change_this',
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000, // 24 hours
  
  // Redis (Optional, for caching/rate limiting)
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: parseInt(process.env.REDIS_PORT) || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_URL: process.env.REDIS_URL || '',
  
  // Email (Optional, for notifications)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@youtube-summarizer.com',
  
  // Analytics
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true' || false,
  ANALYTICS_ID: process.env.ANALYTICS_ID || '',
  
  // File Storage
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local', // 'local', 's3', 'gcs'
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || '',
  
  // Security
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
  PASSWORD_REQUIREMENTS: process.env.PASSWORD_REQUIREMENTS || 'minLength:8,requireUppercase:true,requireLowercase:true,requireNumbers:true,requireSpecialChars:true',
  
  // API
  API_VERSION: process.env.API_VERSION || 'v1',
  API_PREFIX: process.env.API_PREFIX || '/api',
  API_DOCS_ENABLED: process.env.API_DOCS_ENABLED === 'true' || true,
  
  // Subscription Plans
  FREE_PLAN_LIMIT: parseInt(process.env.FREE_PLAN_LIMIT) || 50,
  PRO_PLAN_LIMIT: parseInt(process.env.PRO_PLAN_LIMIT) || 500,
  BUSINESS_PLAN_LIMIT: parseInt(process.env.BUSINESS_PLAN_LIMIT) || 5000,
  
  // WebSocket
  WS_ENABLED: process.env.WS_ENABLED === 'true' || true,
  WS_PATH: process.env.WS_PATH || '/socket.io',
  
  // Cache
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 300, // 5 minutes
  CACHE_ENABLED: process.env.CACHE_ENABLED === 'true' || false,
  
  // Feature Flags
  FEATURE_BATCH_PROCESSING: process.env.FEATURE_BATCH_PROCESSING === 'true' || true,
  FEATURE_VIDEO_UPLOAD: process.env.FEATURE_VIDEO_UPLOAD === 'true' || false,
  FEATURE_SOCIAL_SHARING: process.env.FEATURE_SOCIAL_SHARING === 'true' || true,
  FEATURE_TEAM_COLLABORATION: process.env.FEATURE_TEAM_COLLABORATION === 'true' || false,
  
  // Monitoring
  ENABLE_MONITORING: process.env.ENABLE_MONITORING === 'true' || false,
  MONITORING_PORT: parseInt(process.env.MONITORING_PORT) || 9090,
  
  // Backup
  BACKUP_ENABLED: process.env.BACKUP_ENABLED === 'true' || false,
  BACKUP_SCHEDULE: process.env.BACKUP_SCHEDULE || '0 2 * * *', // Daily at 2 AM
  BACKUP_RETENTION_DAYS: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30
};

// Validate required environment variables in production
if (env.NODE_ENV === 'production') {
  const required = ['JWT_SECRET', 'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASSWORD'];
  const missing = required.filter(key => !env[key] || env[key] === '');
  
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
  }
}

// Database URL (for compatibility)
env.DATABASE_URL = process.env.DATABASE_URL || 
  `${env.DB_DIALECT}://${env.DB_USER}:${env.DB_PASSWORD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;

// Helper methods
env.isDevelopment = () => env.NODE_ENV === 'development';
env.isProduction = () => env.NODE_ENV === 'production';
env.isTest = () => env.NODE_ENV === 'test';

// Get database configuration for Sequelize
env.getDatabaseConfig = () => ({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  dialect: env.DB_DIALECT,
  logging: env.isDevelopment() ? console.log : false,
  pool: {
    max: env.DB_POOL_MAX,
    min: env.DB_POOL_MIN,
    acquire: env.DB_POOL_ACQUIRE,
    idle: env.DB_POOL_IDLE
  },
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

// Get CORS configuration
env.getCorsConfig = () => ({
  origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
  credentials: env.CORS_CREDENTIALS,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
  exposedHeaders: ['Content-Disposition']
});

// Get rate limit configuration
env.getRateLimitConfig = () => ({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests, please try again later'
  }
});

// Get file upload configuration
env.getUploadConfig = () => ({
  limits: {
    fileSize: env.UPLOAD_MAX_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (env.ALLOWED_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Allowed types: ${env.ALLOWED_FILE_TYPES.join(', ')}`), false);
    }
  }
});

// Get subscription limits
env.getSubscriptionLimits = (plan) => {
  const limits = {
    free: env.FREE_PLAN_LIMIT,
    pro: env.PRO_PLAN_LIMIT,
    business: env.BUSINESS_PLAN_LIMIT
  };
  return limits[plan] || limits.free;
};

// Log environment summary (in development)
if (env.isDevelopment()) {
  console.log('=== Environment Configuration ===');
  console.log(`NODE_ENV: ${env.NODE_ENV}`);
  console.log(`PORT: ${env.PORT}`);
  console.log(`Database: ${env.DB_NAME}@${env.DB_HOST}:${env.DB_PORT}`);
  console.log(`CORS Origin: ${env.CORS_ORIGIN}`);
  console.log(`OpenAI API: ${env.OPENAI_API_KEY ? 'Configured' : 'Not Configured'}`);
  console.log(`Gemini API: ${env.GEMINI_API_KEY ? 'Configured' : 'Not Configured'}`);
  console.log('================================');
}

module.exports = env;