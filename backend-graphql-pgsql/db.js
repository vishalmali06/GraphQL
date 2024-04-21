const { Pool } = require('pg');

const dbConfig = {
    host: 'localhost',
    user: 'postgres',
    password: 'root',
    port: 5432,
    database: 'products'
};

const pool = new Pool(dbConfig);

async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();
        console.log('Connected to PostgreSQL database!');
        client.release();
    } catch (error) {
        console.error('Error connecting to PostgreSQL database:', error);
        throw new Error('Failed to connect to PostgreSQL database');
    }
}

module.exports = { pool, checkDatabaseConnection };
