const express = require('express');
const { ApolloServer, makeExecutableSchema } = require('apollo-server-express');
// const { applyMiddleware } = require('graphql-middleware');
// const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive');

const datasources = require('./datasources');
const typeDefs = require('./schemas');
const resolvers = require('./resolvers');
const { getUserToken } = require('./datasources/utils/controllers');
// const { checkAuth } = require('./middlewares/checkAuth');
// const { permissions } = require('./middlewares/permissions');

const app = express();
// app.use(checkAuth);
const schema = makeExecutableSchema({ typeDefs,
  resolvers });

const server = new ApolloServer({
  schema,
  dataSources: datasources,
  context: async ({ req }) => {
    // const queryString = req.body.query;
    // console.log(req.headers);
    const user = await getUserToken({ req });
    // if (queryString.includes('login') || queryString.includes('query')) {
    //   return { user };
    // }
    // if (!user && queryString.includes('mutation')) {
    //   throw new Error('You must login!');
    // }
    return { user };
  },
});

server.applyMiddleware({ app, path: '/' });
module.exports = app;
