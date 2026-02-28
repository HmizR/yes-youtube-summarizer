// models/index.js
const { sequelize } = require('../config/database');
const fs = require('fs');
const path = require('path');

const basename = path.basename(__filename);
const db = {};

// Load all models
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file !== 'index.js' // Explicitly exclude index.js
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

// Add operators for queries
db.Op = db.Sequelize.Op;

module.exports = db;