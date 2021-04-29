const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const { readFileSync } = require('fs');

const supergraphSchema = readFileSync('./graphQL/supergraph.graphql').toString();

// Initialize an ApolloGateway instance and pass it an array of
// your implementing service names and URLs
const gateway = new ApolloGateway({
  supergraphSdl: supergraphSchema,
  // serviceList: [
  //   { name: 'users', url: 'http://localhost:4000/graphql' },
  //   { name: 'posts', url: 'http://localhost:4001/graphql' },
  //   // Define additional services here
  // ],
});

// Pass the ApolloGateway to the ApolloServer constructor
const server = new ApolloServer({
  gateway,

  // Disable subscriptions (not currently supported with ApolloGateway)
  subscriptions: false,
});

server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
