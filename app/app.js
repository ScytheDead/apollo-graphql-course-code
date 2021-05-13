const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive');

const datasources = require('./datasources');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { checkAuth } = require('./middlewares/checkAuth');
const { permissions } = require('./middlewares/permissions');

const app = express();
app.use(checkAuth);

const server = new ApolloServer({
  schema: applyMiddleware(
    makeExecutableSchema({
      typeDefs: [constraintDirectiveTypeDefs, typeDefs],
      resolvers,
      schemaTransforms: [constraintDirective()],
    }),
    permissions,
  ),

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
