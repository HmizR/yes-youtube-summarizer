const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Summary = sequelize.define('Summary', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    video_id: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    video_title: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    channel_name: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    channel_id: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    thumbnail_url: {
      type: DataTypes.STRING(1000)
    },
    duration: {
      type: DataTypes.STRING(20)
    },
    views: {
      type: DataTypes.STRING(50)
    },
    likes: {
      type: DataTypes.STRING(50)
    },
    published_at: {
      type: DataTypes.DATE
    },
    summary: {
      type: DataTypes.TEXT('long'),
      allowNull: true
    },
    key_points: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    transcript: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    chapters: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    original_word_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    summary_word_count: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    reduction_percentage: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    time_saved: {
      type: DataTypes.STRING(50)
    },
    tags: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    category: {
      type: DataTypes.ENUM('Technology', 'Programming', 'Business', 'Education', 'Entertainment', 'Other'),
      defaultValue: 'Other'
    },
    sentiment: {
      type: DataTypes.ENUM('positive', 'neutral', 'negative'),
      defaultValue: 'neutral'
    },
    complexity: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      defaultValue: 'medium'
    },
    status: {
      type: DataTypes.ENUM('processing', 'completed', 'failed'),
      defaultValue: 'processing'
    },
    processing_time: {
      type: DataTypes.INTEGER // in seconds
    },
    ai_model: {
      type: DataTypes.STRING(50),
      defaultValue: 'gemma-2-2b-it'
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_bookmarked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    download_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    share_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    tableName: 'summaries',
    indexes: [
      {
        unique: true,
        fields: ['video_id', 'user_id']
      },
      {
        fields: ['user_id', 'created_at']
      },
      {
        fields: ['video_id']
      },
      {
        fields: ['category']
      },
      {
        fields: ['status']
      },
    //   {
    //     fields: ['tags'],
    //     using: 'BTREE'
    //   }
    ]
  });

  // Associations
  Summary.associate = (models) => {
    Summary.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });

    // Add these new associations:
    Summary.hasMany(models.DiscussionThread, {
      foreignKey: 'summary_id',
      as: 'discussions',
      onDelete: 'CASCADE'
    });
    
    // Summary.hasMany(models.SuggestedQuestion, {
    //   foreignKey: 'summary_id',
    //   as: 'suggested_questions',
    //   onDelete: 'CASCADE'
    // });
  };

  return Summary;
};