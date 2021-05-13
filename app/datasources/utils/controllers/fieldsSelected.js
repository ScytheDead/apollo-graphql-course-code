const graphqlFields = require('graphql-fields');

const getFieldsSelection = (info, fieldPath) => {
  const resolverInfo = graphqlFields(info, {}, { processArguments: true });
  const selections = resolverInfo[fieldPath] !== undefined ? resolverInfo[fieldPath] : resolverInfo;
  const fieldsSelection = Object.keys(selections).reduce((a, b) => ({ ...a, [b]: 1 }), {});
  return fieldsSelection;
};
module.exports = getFieldsSelection;
