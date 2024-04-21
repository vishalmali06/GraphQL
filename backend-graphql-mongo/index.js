// Import the ApolloServer class from the 'apollo-server' package
const { ApolloServer } = require('apollo-server');

// Import the GraphQL schema (type definitions) from './schema' file
const typeDefs  = require('./schema');

// Import the resolvers from './resolvers' file
const resolvers  = require('./resolvers');

// Create a new ApolloServer instance
const server = new ApolloServer({
  // Define type definitions for the GraphQL schema
  typeDefs : typeDefs,

  // Define resolvers for the GraphQL schema
  resolvers : resolvers,

  // Define the context function which runs for each GraphQL operation
  context: ({ req }) => {
    // Extract headers or any other information from the request
    const headers = req.headers;

    // You can add more data to the context if needed
    // For example, you might want to decode and verify the Authorization token here
    return { headers };
  }
});

// Start the ApolloServer and listen for incoming requests
server.listen({ port: 9000 }).then(({ url }) => console.log(`Server running at ${url}`));
