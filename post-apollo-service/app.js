const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');
const { applyMiddleware } = require('graphql-middleware');
const { addResolversToSchema } = require('apollo-graphql');
const { buildFederatedSchema } = require('@apollo/federation');
const Redis = require('ioredis');
require('dotenv').config();

const typeDefs = require('./GraphQL');
const resolvers = require('./GraphQL/resolvers');
const { permissions } = require('./GraphQL/permissions');
const { postReference } = require('./GraphQL/resolvers/reference.resolver');
const UsersAPI = require('./datasources/UsersAPI');

// Setup connect to MongoDB Atlas database
mongoose.connect(
  process.env.URL_CONNECT_MONGO_ATLAS,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true },
).then(() => console.log('Connected DB')).catch(error => console.log(error));

// Setup redis
const client = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  family: 4,
  db: 0,
});

// Create app
const app = express();
// App middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(process.env.PORT, console.log(`App running with port ${process.env.PORT}!`));

const schema = applyMiddleware(
  buildFederatedSchema([{ typeDefs, resolvers }]),
  permissions,
);
addResolversToSchema(schema, postReference);

// Create new instance Apollo Server
const server = new ApolloServer({
  schema,
  // typeDefs,
  // resolvers,
  subscriptions: {
    path: '/subscriptions',
  },
  cacheControl: {
    defaultMaxAge: 5,
    stripFormattedExtensions: false,
    calculateCacheControlHeaders: false,
  },
  context: ({ req }) => {
    const user = req.headers.user ? JSON.parse(req.headers.user) : null;

    return {
      user,
      redis: client,
      dataSources: {
        UsersAPI: new UsersAPI(),
      },
    };
  },
});

server.applyMiddleware({ app });
