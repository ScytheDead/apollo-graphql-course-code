const getFields = require('./fieldsSelected');
const token = require('./token');

module.exports = {
  getFields,
  ...token,
};
