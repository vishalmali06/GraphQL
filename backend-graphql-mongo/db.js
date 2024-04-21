// Import the Mongoose library
const mongoose = require('mongoose');

// URL of the MongoDB database
const dbUrl = 'mongodb://127.0.0.1:27017/products';

// Function to connect to MongoDB database
const connectDB = async () => {
    try {
        // Attempt to connect to the MongoDB database using Mongoose
        await mongoose.connect(dbUrl, { useNewUrlParser: true });
        console.log('MongoDB connected'); // Log a success message if connection is successful
    } catch (error) {
        // Log and handle any errors that occur during database connection
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit process with failure if unable to connect to database
    }
};

// Export the connectDB function for use in other modules
module.exports = connectDB;
