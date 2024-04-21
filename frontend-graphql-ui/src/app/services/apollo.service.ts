import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApolloService {
  // ... other methods
  constructor(
    private apollo: Apollo) { }

  login(username: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation login($username: String!, $password: String!) {
          login(username: $username, password: $password) 
          {
            token
            username
          }
        }
        `,
      variables: {
        username,
        password,
      },
    });
  }

  addProduct(product: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
        mutation AddProduct($category: String, $productName: String!, $price: Int, $colors: [String!], $imgPath: String) {
          addProduct(category: $category, productName: $productName, price: $price, colors: $colors, imgPath: $imgPath) {
            id
            category
            productName
            price
            colors
          }
        }
      `,
      variables: {
        "category": product.category,
        "productName": product.productName,
        "price": product.price,
        "imgPath": product.imgPath,
        "colors": product.colors
      },
    });
  }

  
  deleteProduct(productId: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation Login($deleteProductId: ID!) {
        deleteProduct(id: $deleteProductId)
      }
        `,
      variables: {
        "deleteProductId": productId
      },
    });
  }

  updateProduct(product: any): Observable<any> {
    return this.apollo.mutate({
      mutation: gql`
      mutation UpdateProduct($updateProductId: ID!, $category: String!, $productName: String!, $price: Int!, $imgPath: String!, $colors: [String!]) {
        updateProduct(id: $updateProductId, category: $category, productName: $productName, price: $price, imgPath: $imgPath, colors: $colors) {
          id
          category
          productName
          price
          colors
        }
      }
        `,
      variables: {
        "updateProductId": product.id,
        "category": product.category,
        "productName": product.productName,
        "price": product.price,
        "imgPath": "/laptop",
        "colors": product.colors
      },
    });
  }

}