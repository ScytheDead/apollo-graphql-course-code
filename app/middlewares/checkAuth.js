const { authenticateStore: redis } = require('../datasources/utils/redis/stores');

const checkAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  req.user = null;
  if (authorization) {
    const user = await redis.getAsync(authorization);
    if (user) {
      req.user = JSON.parse(user);
    }
  }
  next();
};

module.exports = { checkAuth };
