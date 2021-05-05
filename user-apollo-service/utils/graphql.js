const graphqlFields = require('graphql-fields');

exports.getSelectedFieldsString = info => {
  const topLevelFields = Object.keys(graphqlFields(info));
  return topLevelFields.join(' ');
};
