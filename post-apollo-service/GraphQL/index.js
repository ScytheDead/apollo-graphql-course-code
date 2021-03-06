const path = require('path');
const { loadFilesSync } = require('@graphql-tools/load-files');
const { mergeTypeDefs } = require('@graphql-tools/merge');

const typeDefsArray = loadFilesSync(path.join(__dirname, 'typeDefs'), { recursive: true });

const typeDefs = mergeTypeDefs(typeDefsArray);

module.exports = typeDefs;
