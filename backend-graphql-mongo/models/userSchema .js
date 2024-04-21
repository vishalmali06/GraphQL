// Import the Mongoose library
const mongoose = require('mongoose');

// Define a schema for the user details
const userDetailsSchema = new mongoose.Schema({
    // Define the structure of the document
    username: String,   // Field to store the username of the user
    password: String   // Field to store the password of the user
});

// Create and export a model based on the schema
// This will create a collection named 'userdetails' in the MongoDB database
// The model allows us to interact with the 'userdetails' collection
module.exports = mongoose.model('userdetails', userDetailsSchema);

