// models/DiscussionMessage.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DiscussionMessage = sequelize.define('DiscussionMessage', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    thread_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'discussion_threads',
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'assistant', 'system'),
      allowNull: false,
      defaultValue: 'user'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    model_used: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    token_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_processed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'discussion_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // We don't need updated_at for messages
    indexes: [
      {
        name: 'idx_discussion_messages_thread_id',
        fields: ['thread_id']
      },
      {
        name: 'idx_discussion_messages_user_id',
        fields: ['user_id']
      },
      {
        name: 'idx_discussion_messages_created_at',
        fields: ['created_at']
      },
      {
        name: 'idx_discussion_messages_role',
        fields: ['role']
      }
    ]
  });

  DiscussionMessage.associate = (models) => {
    DiscussionMessage.belongsTo(models.DiscussionThread, {
      foreignKey: 'thread_id',
      as: 'thread',
      onDelete: 'CASCADE'
    });
    
    DiscussionMessage.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
      onDelete: 'SET NULL'
    });
  };

  return DiscussionMessage;
};