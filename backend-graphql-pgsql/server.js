const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const { pool } = require('./db');

async function startApolloServer() {
    const server = new ApolloServer({ 
        typeDefs, 
        resolvers, 
        context: ({ req }) => ({ 
            user: null, // Initialize user to null
            pool: pool,   // Pass MySQL connection pool to context
            headers: req.headers // Pass request headers to context
        }) 
    });
    await server.start();

    const app = express();
    server.applyMiddleware({ app });

    return { server, app };
}

module.exports = { startApolloServer };
