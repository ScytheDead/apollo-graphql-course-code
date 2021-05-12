const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const datasources = require('./datasources');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');

const app = express();

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),
  // resolvers,
  dataSources: datasources,
  context: () => {},
});

server.applyMiddleware({ app, path: '/' });
module.exports = app;
