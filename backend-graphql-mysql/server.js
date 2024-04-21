// Import necessary modules
const express = require('express');
const { ApolloServer } = require('apollo-server-express');

// Import GraphQL type definitions and resolvers
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

// Import MySQL connection pool
const { pool } = require('./db');

// Function to start Apollo Server
async function startApolloServer() {
    // Create a new ApolloServer instance
    const server = new ApolloServer({ 
        typeDefs, // GraphQL type definitions
        resolvers, // GraphQL resolvers
        context: ({ req }) => ({ 
            user: null, // Initialize user to null (can be populated later if needed)
            pool: pool, // Pass MySQL connection pool to context for resolvers to use
            headers: req.headers // Pass request headers to context
        }) 
    });

    // Start the Apollo Server
    await server.start();

    // Create a new Express application
    const app = express();

    // Apply middleware to integrate Apollo Server with Express
    server.applyMiddleware({ app });

    // Return the server and the Express app
    return { server, app };
}

// Export the function to start the Apollo Server
module.exports = { startApolloServer };
