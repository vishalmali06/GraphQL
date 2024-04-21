const { gql } = require('apollo-server-express');

const typeDefs = gql`
    scalar JSON

    type Product {
        id: ID
        category: String
        productName: String
        price: Int!
        colors: JSON
    }

    type Query {
        products: [Product]
        product(id: ID!): Product
        getPaginatedProducts(pageNumber: Int, pageSize: Int): PaginatedProducts
    }

    type AuthPayload {
        username: String
        token: String
    }

    type PaginatedProducts {
        products: [Product]
        totalRecords: Int!
    }

    type Mutation {
        addProduct(category: String, productName: String!, price: Int, colors: [String!], imgPath: String): Product
        updateProduct(id: ID! ,category: String!, productName: String!, price: Int!, colors: [String!], imgPath: String!): Product
        deleteProduct(id: ID!): Boolean!
        login(username: String!, password: String!): AuthPayload
    }
`;

module.exports = typeDefs;
