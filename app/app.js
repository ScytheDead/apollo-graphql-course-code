const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const datasources = require('./datasources');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { getUserToken } = require('./datasources/utils/controllers');

const app = express();
const schema = makeExecutableSchema({ typeDefs,
  resolvers });

const server = new ApolloServer({
  schema,
  dataSources: datasources,
  context: async ({ req }) => {
    const user = await getUserToken({ req });
    return { user };
  },
});

server.applyMiddleware({ app, path: '/' });
module.exports = app;
