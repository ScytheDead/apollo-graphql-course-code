require('dotenv').config();
const { port } = require('./config/server');
const app = require('./app');
// TODO: run server
app.listen(port, console.log(`App running with port ${process.env.PORT}!`));
