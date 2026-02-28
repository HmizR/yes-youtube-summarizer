const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50]
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255]
      }
    },
    avatar: {
      type: DataTypes.STRING(500),
      defaultValue: 'https://ui-avatars.com/api/?name=User&background=random'
    },
    role: {
      type: DataTypes.ENUM('user', 'admin', 'premium'),
      defaultValue: 'user'
    },
    summaries_created: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    total_time_saved: {
      type: DataTypes.INTEGER, // in minutes
      defaultValue: 0
    },
    total_words_saved: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    preferred_ai_model: {
      type: DataTypes.ENUM('gpt-4', 'gpt-3.5-turbo', 'gemini-pro', 'gemma-2-2b-it'),
      defaultValue: 'gemma-2-2b-it'
    },
    default_summary_length: {
      type: DataTypes.ENUM('short', 'medium', 'long'),
      defaultValue: 'medium'
    },
    auto_save_transcript: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    subscription_plan: {
      type: DataTypes.ENUM('free', 'pro', 'business'),
      defaultValue: 'free'
    },
    subscription_expires_at: {
      type: DataTypes.DATE
    },
    monthly_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },
    used_this_month: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    api_key: {
      type: DataTypes.STRING(500),
      unique: true
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    reset_password_token: {
      type: DataTypes.STRING(500)
    },
    reset_password_expire: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Instance methods
  User.prototype.generateAuthToken = function() {
    return jwt.sign(
      { id: this.id, role: this.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRE }
    );
  };

  User.prototype.generateApiKey = function() {
    const apiKey = jwt.sign(
      { id: this.id, type: 'api' },
      env.JWT_SECRET,
      { expiresIn: '365d' }
    );
    this.api_key = apiKey;
    return apiKey;
  };

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.canCreateSummary = function() {
    if (this.role === 'admin') return true;
    if (this.subscription_plan === 'free') {
      return this.used_this_month < this.monthly_limit;
    }
    return true;
  };

  // Associations
  User.associate = (models) => {
    User.hasMany(models.Summary, {
      foreignKey: 'user_id',
      as: 'summaries'
    });
    User.hasMany(models.ApiKey, {
      foreignKey: 'user_id',
      as: 'api_keys'
    });

    // Add these new associations:
    User.hasMany(models.DiscussionThread, {
      foreignKey: 'user_id',
      as: 'discussion_threads',
      onDelete: 'CASCADE'
    });
    
    User.hasMany(models.DiscussionMessage, {
      foreignKey: 'user_id',
      as: 'discussion_messages',
      onDelete: 'SET NULL'
    });
  };

  return User;
};