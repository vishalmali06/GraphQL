const CONSTANTS = require('./constants');
const AuthService = require('./AuthService');
const { pool } = require('./db'); // Import MySQL connection pool
const jwt = require('jsonwebtoken');

const resolvers = {
    Query: {
        // Resolver for fetching all products
        products: async (_, __, context) => {
            await authorize(context);
            try {
                const connection = await pool.getConnection(); // Get connection from pool
                const [rows] = await connection.query('SELECT * FROM productlists'); // Execute query to fetch all products
                connection.release(); // Release connection back to pool
                return rows; // Return fetched products
            } catch (error) {
                console.error('Error fetching productlists:', error); // Log error if query fails
                throw new Error('Failed to fetch productlists'); // Throw an error indicating failure
            }
        },

        // Resolver for fetching a single product by ID
        product: async (_, { id }, context) => {
            await authorize(context);
            try {
                const connection = await pool.getConnection(); // Get connection from pool
                const [rows] = await connection.query('SELECT * FROM productlists WHERE id = ?', [id]); // Execute query to fetch product by ID
                connection.release(); // Release connection back to pool
                return rows[0]; // Return the first product (assuming query returns only one product)
            } catch (error) {
                console.error('Error fetching product:', error); // Log error if query fails
                throw new Error('Failed to fetch product'); // Throw an error indicating failure
            }
        },

        // Resolver for fetching paginated products
        getPaginatedProducts: async (_, { pageNumber, pageSize }, context) => {
            console.log("mysql ==================== mysql");
            await authorize(context);
            try {
                // Calculate the offset based on pageNumber and pageSize
                const offset = Math.max(0, (pageNumber - 1)) * pageSize;

                // Get connection from pool
                const connection = await pool.getConnection();

                // Query products with pagination
                const [products] = await connection.execute(`SELECT * FROM productlists LIMIT ${offset}, ${pageSize}`);

                // Query total number of products
                const [totalRecords] = await connection.execute('SELECT COUNT(*) AS total FROM productlists');
                const total = totalRecords[0].total;

                // Release connection
                connection.release();

                // Return paginated products and total records
                return {
                    products,
                    totalRecords: total,
                };
            } catch (error) {
                console.error('Error fetching paginated products:', error); // Log error if query fails
                throw new Error('Failed to fetch paginated products'); // Throw an error indicating failure
            }
        },
    },

    Mutation: {
        // Resolver for adding a new product
        addProduct: async (_, args, context) => {
            await authorize(context);
            try {
                // Extract arguments
                const { category, productName, price, colors, imgPath } = args;
                const connection = await pool.getConnection(); // Get connection from pool
                // Execute query to insert new product
                const [result] = await connection.query('INSERT INTO productlists (category, productName, price, colors, imgPath) VALUES (?, ?, ?, ?, ?)', [category, productName, price, JSON.stringify(colors), imgPath]);
                connection.release(); // Release connection back to pool
                const insertedProductId = result.insertId; // Extract inserted product ID
                // Return the newly inserted product
                return {
                    id: insertedProductId,
                    category,
                    productName,
                    price,
                    colors,
                    imgPath
                };
            } catch (error) {
                console.error('Error adding product:', error); // Log error if query fails
                throw new Error('Failed to add product'); // Throw an error indicating failure
            }
        },

        // Resolver for updating an existing product
        updateProduct: async (_, args, context) => {
            await authorize(context);
            try {
                // Extract arguments
                const { id, category, productName, price, colors, imgPath } = args;
                const connection = await pool.getConnection(); // Get connection from pool
                // Execute query to update product
                await connection.query('UPDATE productlists SET category = ?, productName = ?, price = ?, colors = ?, imgPath = ? WHERE id = ?', [category, productName, price, JSON.stringify(colors), imgPath, id]);
                connection.release(); // Release connection back to pool
                // Return updated product details
                return { id, category, productName, price, colors, imgPath };
            } catch (error) {
                console.error('Error updating product:', error); // Log error if query fails
                throw new Error('Failed to update product'); // Throw an error indicating failure
            }
        },

        // Resolver for deleting a product
        deleteProduct: async (_, args, context) => {
            await authorize(context);
            try {
                // Extract argument
                const { id } = args;
                const connection = await pool.getConnection(); // Get connection from pool
                // Execute query to delete product
                await connection.query('DELETE FROM productlists WHERE id = ?', [id]);
                connection.release(); // Release connection back to pool
                // Return the ID of the deleted product
                return { id };
            } catch (error) {
                console.error('Error deleting product:', error); // Log error if query fails
                throw new Error('Failed to delete product'); // Throw an error indicating failure
            }
        },

        // Resolver for user login
        login: async (_, { username, password }) => {
            try {
                // Get connection from pool
                const connection = await pool.getConnection();
                // Query user by username and password
                const [rows] = await connection.execute('SELECT * FROM userdetails WHERE username = ? AND password = ?', [username, password]);
                connection.release(); // Release connection back to pool
                // If no user found, return error
                if (rows.length === 0) {
                    console.log('Invalid credentials');
                    throw new Error('Invalid credentials');
                }
                // Get the first user from the result
                const user = rows[0];
                // Generate JWT token
                const token = jwt.sign({ userId: user.id }, CONSTANTS.SECRET_KEY, { expiresIn: '24h' });
                // Return username and token
                return {
                    username: user.username,
                    token,
                };
            } catch (error) {
                console.error('Error during login:', error); // Log error if query fails
                return { error: 'Invalid credentials' }; // Return error message
            }
        },
    },
};

async function authorize(context) {
    const { headers } = context;
    const authorizationHeader = headers.authorization;
    const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
    if (!user) {
        throw new Error('Unauthorized. Please log in.');
    }
}

module.exports = resolvers; // Export resolvers
