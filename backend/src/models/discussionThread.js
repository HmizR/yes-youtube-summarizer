// models/DiscussionThread.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DiscussionThread = sequelize.define('DiscussionThread', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    summary_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'summaries',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    model_used: {
      type: DataTypes.STRING(50),
      defaultValue: 'gemma-2-2b-it',
      allowNull: false
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    message_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'discussion_threads',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'idx_discussion_threads_summary_id',
        fields: ['summary_id']
      },
      {
        name: 'idx_discussion_threads_user_id',
        fields: ['user_id']
      },
      {
        name: 'idx_discussion_threads_created_at',
        fields: ['created_at']
      }
    ]
  });

  DiscussionThread.associate = (models) => {
    DiscussionThread.belongsTo(models.Summary, {
      foreignKey: 'summary_id',
      as: 'summary'
    });
    
    DiscussionThread.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    
    DiscussionThread.hasMany(models.DiscussionMessage, {
      foreignKey: 'thread_id',
      as: 'messages',
      onDelete: 'CASCADE'
    });
  };

  return DiscussionThread;
};