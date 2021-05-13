const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');

const datasources = require('./datasources');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { checkAuth } = require('./middlewares/checkAuth');

const app = express();
app.use(checkAuth);

const server = new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs,
    resolvers,
  }),

  dataSources: datasources,
  context: ({ req }) => {
    const { user } = req;
    return {
      user,
    };
  },
});

server.applyMiddleware({ app, path: '/' });
module.exports = app;
