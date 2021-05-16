// const { authenticateStore: redis } = require('../datasources/utils/redis/stores');

// const checkAuth = async (req, res, next) => {
//   const { authorization } = req.headers;
//   req.user = null;
//   if (authorization) {
//     let user = await redis.getAsync(authorization);
//     if (user) {
//       user = JSON.parse(user);
//       req.user = user;
//     }
//   }
//   next();
// };

// module.exports = { checkAuth };
