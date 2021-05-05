/* eslint-disable no-console */
const redisSet = (redis, key, value, expirationTime) => {
  const { EXPIRATION_TIME_TYPE } = process.env;
  redis.set(key, JSON.stringify(value), EXPIRATION_TIME_TYPE, expirationTime);
};

const redisGet = async (redis, key) => JSON.parse(await redis.get(key));

// const redisRemoveKey = (redis, key) => {
//   redis.del(key);
// };

const redisRemoveAllKeysByPattern = (redis, pattern) => new Promise(resolve => {
  const stream = redis.scanStream({
    match: pattern,
  });

  stream.on('data', keys => {
    const deleteCommands = keys.map(key => ['del', key]);
    redis.multi(deleteCommands).exec();
  });

  stream.on('end', () => {
    console.log(`Clear cache by pattern '${pattern}' is done !`);
    resolve();
  });
});

module.exports = {
  redisGet,
  redisSet,
  redisRemoveAllKeysByPattern,
};
