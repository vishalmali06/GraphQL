// Import the Mongoose library
const mongoose = require('mongoose');

// Define a schema for the file details
const fileDetailsSchema = new mongoose.Schema({
    // Define the structure of the document
    filecontent: String, // Field to store the content of the file
    filename: String,     // Field to store the name of the file
    mimetype: String,     // Field to store the MIME type of the file
    encoding: String     // Field to store the encoding of the file
});

// Create and export a model based on the schema
// This will create a collection named 'filedetails' in the MongoDB database
// The model allows us to interact with the 'filedetails' collection
module.exports = mongoose.model('filedetails', fileDetailsSchema);

