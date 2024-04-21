const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Product {
        id: ID
        category: String
        productName: String
        price: Int!
        colors: [String!]
    }

    type PaginatedProducts {
        products: [Product]!
        totalRecords: Int!
    }

    type Query {
        getProductsList: [Product]
        getProduct(id: ID!): Product
        getPaginatedProducts(pageNumber: Int, pageSize: Int): PaginatedProducts
    }

    scalar Upload

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }


    type AuthResponse {
        username: String
        token: String
    }

    type Mutation {
        updateProduct(id: ID!, category: String!, productName: String!, price: Int!, colors: [String!], imgPath: String!): Product
        addProduct(category: String, productName: String!, price: Int, colors: [String!], imgPath: String): Product
        deleteProduct(id: ID!): Boolean!
        uploadFile(file: Upload!): File
        login(username: String!, password: String!): AuthResponse
        singleUpload(file: Upload!): File
    }
`;

module.exports = typeDefs;
