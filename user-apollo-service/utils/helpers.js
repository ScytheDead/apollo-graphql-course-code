const createKeyRedisUserSession = (id, selectedFieldsString) => `user:session-${id}-${selectedFieldsString}`;
const createKeyRedisGetAllUser = selectedFieldsString => `user:${selectedFieldsString}`;

module.exports = {
  createKeyRedisUserSession,
};
