const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { readFileSync } = require('fs');
const express = require('express');
const expressJwt = require('express-jwt');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(
  expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: [process.env.JWT_ALGORITHM_ENCRYPTION],
    credentialsRequired: false,
  }),
);

const supergraphSchema = readFileSync('./graphQL/supergraph.graphql').toString();

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
  // supergraphSdl: supergraphSchema,
  serviceList: [
    { name: 'users', url: 'http://localhost:4000/graphql' },
    { name: 'posts', url: 'http://localhost:4001/graphql' },
    // Define additional services here
  ],
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set(
          'user',
          context.user ? JSON.stringify(context.user) : null,
        );
      },
    });
  },
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
  context: ({ req }) => {
    const user = req.user || null;
    return { user };
  },
});

server.applyMiddleware({ app });

app.listen(PORT, () => console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`));
