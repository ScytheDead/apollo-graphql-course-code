require('dotenv').config();
const app = require('./app');
// TODO: run server
app.listen(process.env.PORT, console.log(`App running with port ${process.env.PORT}!`));
