const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ApiKey = sequelize.define('ApiKey', {
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
    api_key: {
      type: DataTypes.STRING(500),
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING(100),
      defaultValue: 'Default'
    },
    rate_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 100
    },
    usage: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    last_used: {
      type: DataTypes.DATE
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'api_keys',
    timestamps: true
  });

  // Associations
  ApiKey.associate = (models) => {
    ApiKey.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
  };

  return ApiKey;
};