const CONSTANTS = require('./constants');
const { pool } = require('./db');
const jwt = require('jsonwebtoken');
const AuthService = require('./AuthService');

const resolvers = {
    Query: {
        products: async (_, args, context) => {
            await authorize(context);
            try {
                const client = await pool.connect();
                const query = 'SELECT * FROM productlists';
                const result = await client.query(query);
                client.release();
                return result.rows;
            } catch (error) {
                console.error('Error fetching productlists:', error);
                throw new Error('Failed to fetch productlists');
            }
        },

        product: async (_, { id }, context) => {
            await authorize(context);
            try {
                const client = await pool.connect();
                const query = 'SELECT * FROM productlists WHERE id = $1';
                const result = await client.query(query, [id]);
                client.release();
                return result.rows[0];
            } catch (error) {
                console.error('Error fetching product:', error);
                throw new Error('Failed to fetch product');
            }
        },

        getPaginatedProducts: async (_, { pageNumber, pageSize }, context) => {
            console.log("pgsql ==================== pgsql");
            await authorize(context);
            try {
                const offset = Math.max(0, (pageNumber - 1)) * pageSize;
                const client = await pool.connect();
                await client.query('BEGIN');
                const queryProducts = {
                    text: 'SELECT * FROM productlists OFFSET $1 LIMIT $2',
                    values: [offset, pageSize],
                };
                const productsResult = await client.query(queryProducts);
                const queryTotal = 'SELECT COUNT(*) AS total FROM productlists';
                const totalRecordsResult = await client.query(queryTotal);
                const total = totalRecordsResult.rows[0].total;
                await client.query('COMMIT');
                client.release();
                return {
                    products: productsResult.rows,
                    totalRecords: total,
                };
            } catch (error) {
                await client.query('ROLLBACK');
                console.error('Error fetching paginated products:', error);
                throw new Error('Failed to fetch paginated products');
            }
        }
    },

    Mutation: {
        addProduct: async (parent, args, context) => {
            await authorize(context);
            try {
                const { category, productName, price, colors, imgPath } = args;
                const client = await pool.connect();
                const query = 'INSERT INTO productlists (category, productName, price, colors, imgPath) VALUES ($1, $2, $3, $4, $5) RETURNING id';
                const values = [category, productName, price, JSON.stringify(colors), imgPath];
                const result = await client.query(query, values);
                client.release();
                const insertedProductId = result.rows[0].id;
                return {
                    id: insertedProductId,
                    category,
                    productName,
                    price,
                    colors,
                    imgPath
                };
            } catch (error) {
                console.error('Error adding product:', error);
                throw new Error('Failed to add product');
            }
        },

        updateProduct: async (parent, args, context) => {
            await authorize(context);
            try {
                const { id, category, productName, price, colors, imgPath } = args;
                const client = await pool.connect();
                const query = 'UPDATE productlists SET category = $1, productName = $2, price = $3, colors = $4, imgPath = $5 WHERE id = $6';
                const values = [category, productName, price, JSON.stringify(colors), imgPath, id];
                await client.query(query, values);
                client.release();
                return { id, category, productName, price, colors, imgPath };
            } catch (error) {
                console.error('Error updating product:', error);
                throw new Error('Failed to update product');
            }
        },

        deleteProduct: async (parent, args, context) => {
            await authorize(context);
            try {
                const { id } = args;
                const client = await pool.connect();
                const query = 'DELETE FROM productlists WHERE id = $1';
                const values = [id];
                await client.query(query, values);
                client.release();
                return { id };
            } catch (error) {
                console.error('Error deleting product:', error);
                throw new Error('Failed to delete product');
            }
        },

        login: async (_, { username, password }) => {
            try {
                const client = await pool.connect();
                const query = 'SELECT * FROM userdetails WHERE username = $1 AND password = $2';
                const { rows } = await client.query(query, [username, password]);
                client.release();
                if (rows.length === 0) {
                    console.log('Invalid credentials');
                    throw new Error('Invalid credentials');
                }
                const user = rows[0];
                const token = jwt.sign({ userId: user.id }, CONSTANTS.SECRET_KEY, { expiresIn: '24h' });
                return {
                    username: user.username,
                    token,
                };
            } catch (error) {
                console.error('Error during login:', error);
                return { error: 'Invalid credentials' };
            }
        },
    },
};

// Function to authorize the user based on the token
async function authorize(context) {
    const { headers } = context;
    const authorizationHeader = headers.authorization;
    const user = await AuthService.verifyToken(authorizationHeader);
    if (!user) {
        throw new Error('Unauthorized. Please log in.');
    }
}

module.exports = resolvers;
