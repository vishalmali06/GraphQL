'use strict';

// Import required modules
const fs = require('fs'); // File System module for interacting with the file system
const path = require('path'); // Path module for working with file paths
const Sequelize = require('sequelize'); // Sequelize library for ORM (Object-Relational Mapping)
const process = require('process'); // Process module to access environment variables
const basename = path.basename(__filename); // Get the base name of the current file
const env = process.env.NODE_ENV || 'development'; // Determine the environment (development, production, etc.)
const config = require(__dirname + '/../config/config.json')[env]; // Load database configuration from config.json file
const db = {}; // Initialize an empty object to store database models

let sequelize; // Declare sequelize variable for database connection

// Create a Sequelize instance based on the configuration
if (config.use_env_variable) {
  // If a specific environment variable is provided in the configuration, use it
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  // Otherwise, use the configuration parameters directly
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all files in the current directory (excluding test files and hidden files)
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Exclude hidden files (starting with dot)
      file !== basename && // Exclude the current file itself
      file.slice(-3) === '.js' && // Include only JavaScript files
      file.indexOf('.test.js') === -1 // Exclude test files
    );
  })
  .forEach(file => {
    // For each JavaScript file found, require the model and initialize it with sequelize
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Add the model to the database object with its name as the key
  });

// Iterate through all models in the database object
Object.keys(db).forEach(modelName => {
  // If the model has an 'associate' method, call it to establish associations between models
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach sequelize instance and Sequelize library to the database object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Export the database object
module.exports = db;
