const { checkDatabaseConnection, pool } = require('./db');
const { startApolloServer } = require('./server');

async function main() {
    await checkDatabaseConnection();
    const { server, app } = await startApolloServer(pool);

    const PORT = process.env.PORT || 9002;
    app.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

main().catch(err => {
    console.error('Error starting server:', err);
});
