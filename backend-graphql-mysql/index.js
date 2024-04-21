const { checkDatabaseConnection, pool } = require('./db'); // Import database connection function and pool
const { startApolloServer } = require('./server'); // Import Apollo Server startup function

async function main() {
    await checkDatabaseConnection(); // Check the database connection before starting the server

    // Start Apollo Server and get server instance and Express app
    const { server, app } = await startApolloServer(pool);

    const PORT = process.env.PORT || 9001; // Define the port for the server to listen on
    // Start the Express app to listen for incoming requests
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`); // Log server URL
    });
}

// Call the main function to start the server
main().catch(err => {
    console.error('Error starting server:', err); // Log any errors that occur during server startup
});
