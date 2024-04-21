// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');
const CONSTANTS = require('./constants');

// Function to verify JWT token
const verifyToken = async (token) => {
    // Split the token to extract the actual token value
    const actualToken = token.split(' ')[1];
    
    try {
        // Check if token exists
        if (!actualToken) {
            return null; // Return null if token is missing
        }
        
        // Verify the token using the secret key
        const decoded = jwt.verify(actualToken, CONSTANTS.SECRET_KEY);

        // Additional validation steps if needed can be added here

        return decoded; // Return decoded token payload
    } catch (error) {
        // Log and handle any errors that occur during token verification
        console.error('Token verification error:', error.message);
        return null; // Return null in case of error
    }
};

// Export the verifyToken function for use in other modules
module.exports = { verifyToken };
