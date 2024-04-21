// Import the Mongoose library
const mongoose = require('mongoose');

// Define a schema for the products list
const productsListSchema = new mongoose.Schema({
    // Define the structure of the document
    category: String,   // Field to store the category of the product
    productName: String, // Field to store the name of the product
    price: Number,      // Field to store the price of the product
    colors: Object,     // Field to store the colors available for the product
    imgPath: String     // Field to store the path of the product image
});

// Create and export a model based on the schema
// This will create a collection named 'productlists' in the MongoDB database
// The model allows us to interact with the 'productlists' collection
module.exports = mongoose.model('productlists', productsListSchema);
