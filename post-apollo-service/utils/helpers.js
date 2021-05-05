const createKeyRedisUserSession = id => `user:session-${id}`;

module.exports = {
  createKeyRedisUserSession,
};
