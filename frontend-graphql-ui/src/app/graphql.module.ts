import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { NgModule } from '@angular/core';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { AuthService } from './services/auth.service';
import { HttpHeaders } from '@angular/common/http';

// const port = 9002; // Postgresql
// const port = 9001; // Mysql
const port = 9000; // MongoDB

const uri = `http://localhost:${port}/graphql`;

export function createApollo(httpLink: HttpLink, authService: AuthService): ApolloClientOptions<any> {
  return {
    link: httpLink.create({
      uri,
      headers: new HttpHeaders({
        Authorization: `Bearer ${authService.getToken()}`,
      }),
    }),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthService],
    },
  ],
})
export class GraphQLModule { }
