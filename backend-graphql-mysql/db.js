const mysql = require('mysql2/promise'); // Import the mysql2/promise library for MySQL database connection

// Database configuration object
const dbConfig = {
    host: '127.0.0.1', // MySQL server host
    user: 'root', // MySQL username
    password: 'root', // MySQL password
    database: 'products' // MySQL database name
};

// Create a connection pool using the provided configuration
const pool = mysql.createPool(dbConfig);

// Function to check the database connection
async function checkDatabaseConnection() {
    try {
        const connection = await pool.getConnection(); // Get a connection from the pool
        console.log('Connected to MySQL database!'); // Log success message if connected
        connection.release(); // Release the connection back to the pool
    } catch (error) {
        console.error('Error connecting to MySQL database:', error); // Log error if connection fails
        throw new Error('Failed to connect to MySQL database'); // Throw an error indicating failure to connect
    }
}

// Export the connection pool and the checkDatabaseConnection function
module.exports = { pool, checkDatabaseConnection };
