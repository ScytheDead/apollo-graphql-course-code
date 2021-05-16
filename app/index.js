require('dotenv').config();
const config = require('./config');

const PORT = config.port;
const app = require('./app');

// TODO: run server
app.listen(PORT, console.log(`App running at https://localhost:${PORT}/graphql`));
