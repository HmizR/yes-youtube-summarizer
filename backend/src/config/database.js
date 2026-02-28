const { Sequelize } = require('sequelize');
const env = require('./env');

const sequelize = new Sequelize(
  env.DB_NAME,
  env.DB_USER,
  env.DB_PASSWORD,
  {
    host: env.DB_HOST,
    port: env.DB_PORT,
    dialect: env.DB_DIALECT || 'mysql',
    logging: env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL database connected successfully');
    
    // Sync all models
    if (env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: false, force: false });
      console.log('Database synced');
    }
    
    return sequelize;
  } catch (error) {
    console.error('Unable to connect to MySQL database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };