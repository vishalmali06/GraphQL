const jwt = require('jsonwebtoken');
const AuthService = require('./AuthService'); // Importing the authentication service
const connectDB = require('./db'); // Importing the function to connect to the database
const CONSTANTS = require('./constants'); // Importing constants
const ProductModel = require("./models/productSchema"); // Importing the Product model
const FileModel = require("./models/fileSchema"); // Importing the File model
const UserModel = require("./models/userSchema "); // Importing the User model
const { GraphQLUpload } = require('apollo-upload-server/lib/GraphQLUpload');
const { createWriteStream, existsSync, mkdirSync } = require('fs');
const { join } = require('path');

// Connect to MongoDB
const connect = connectDB; // Reference to the connectDB function

const resolvers = {
    Query: {
        // Resolver for fetching all products
        getProductsList: async (_, args, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            await connect(); // Connect to the database
            return ProductModel.find({}); // Fetch all products from the database
        },
        // Resolver for fetching a single product by ID
        getProduct: async (_, args, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            try {
                await connect(); // Connect to the database
                const result = await ProductModel.findById(args.id); // Find product by ID
                if (!result) {
                    throw new Error('Product not found');
                }
                return result; // Return the found product
            } catch (error) {
                throw new Error(`Error fetching product: ${error.message}`);
            }
        },
        // Resolver for fetching paginated products
        getPaginatedProducts: async (_, { pageNumber, pageSize }, context) => {
            console.log("mongodb ==================== mongodb");
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            await connect(); // Connect to the database
            const skipAmount = (pageNumber - 1) * pageSize;
            const products = await ProductModel.find().skip(skipAmount).limit(pageSize); // Fetch paginated products
            const totalRecords = await ProductModel.countDocuments(); // Count total number of products
            return {
                products,
                totalRecords,
            }; // Return paginated products and total count
        }
    },
    Mutation: {
        // Resolver for updating a product
        updateProduct: async (_, args, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            await connect(); // Connect to the database
            return ProductModel.findByIdAndUpdate(args.id,
                {
                    productName: args.productName,
                    category: args.category,
                    price: args.price,
                    imgPath: args.imgPath,
                    colors: args.colors
                }, { new: true }); // Update product and return the updated product
        },

        singleUpload: async (_, { file }) => {
            try {
              const { createReadStream, filename, mimetype } = await file;
              console.log(file)
            //   const stream = createReadStream();
            //   console.log(stream)
            //   const path = join(__dirname, 'upload', filename);
              
            //   // Ensure the 'upload' directory exists
            //   if (!existsSync(join(__dirname, 'upload'))) {
            //     mkdirSync(join(__dirname, 'upload'));
            //   }
      
            //   // Pipe the file stream to the destination on disk
            //   await new Promise((resolve, reject) => {
            //     const writeStream = createWriteStream(path);
            //     stream.pipe(writeStream);
            //     writeStream.on('finish', resolve);
            //     writeStream.on('error', reject);
            //   });
      
              return { filename, mimetype };
            } catch (error) {
              console.error('Error uploading file:', error);
              throw new Error('Failed to upload file');
            }
          },

        // Resolver for adding a new product
        addProduct: async (_, args, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            await connect(); // Connect to the database
            const product = new ProductModel({
                productName: args.productName,
                category: args.category,
                price: args.price,
                imgPath: args.imgPath,
                colors: args.colors
            });
            return product.save(); // Save the new product and return it
        },
        // Resolver for deleting a product
        deleteProduct: async (_, args, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            try {
                await connect(); // Connect to the database
                await ProductModel.findByIdAndDelete({ _id: args.id }); // Delete product by ID
                return true; // Return true if deletion is successful
            } catch (error) {
                console.log('Error while delete:', error);
                return false; // Return false if deletion fails
            }
        },
        // Resolver for uploading a file
        uploadFile: async (_, { file }, context) => {
            const { headers } = context;
            const authorizationHeader = headers.authorization;
            const user = await AuthService.verifyToken(authorizationHeader); // Verify user's JWT token
            if (!user) {
                throw new Error('Unauthorized. Please log in.');
            }
            const { createReadStream, filename, mimetype, encoding } = await file;
            const stream = createReadStream();
            const filecontent = Buffer.from((await streamToString(stream)).replace(/\r\n/g, '')); // Convert stream to string
            await connect(); // Connect to the database
            const newFile = new FileModel({ filecontent, filename, mimetype, encoding });
            await newFile.save(); // Save file details to MongoDB
            return { filecontent: filecontent.toString(), filename, mimetype, encoding }; // Return uploaded file details
        },
        // Resolver for user login
        login: async (_, { username, password }) => {
            try {
                await connect(); // Connect to the database
                const user = await UserModel.findOne({ username, password }); // Find user by username and password
                if (!user) {
                    console.log('Invalid credentials');
                    throw new Error('Invalid credentials');
                }
                const token = jwt.sign({ userId: user.id }, CONSTANTS.SECRET_KEY, { expiresIn: '24h' }); // Generate JWT token
                return {
                    username: user.username,
                    token,
                }; // Return username and token in response
            } catch (error) {
                console.error('Error during login:', error);
                return { error: 'Invalid credentials' }; // Return error message if login fails
            }
        },
    },
    Upload: GraphQLUpload,
};

module.exports = resolvers;
