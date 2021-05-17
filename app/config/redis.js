module.exports = {
  redisDbs: {
    authDb: {
      port: 6379,
      host: process.env.REDIS_URL || '127.0.0.1',
      auth_pass: process.env.SKIP_TLS ? undefined : process.env.REDIS_AUTH,
      db: parseInt(process.env.AUTHENTICATION_STORE || 0, 10),
      get tls() {
        return (process.env.NODE_ENV === 'test' || process.env.SKIP_TLS) ? undefined : { servername: this.host };
      },
    },
  },
  expirationTimeType: process.env.EXPIRATION_TIME_TYPE || 'EX',
  expirationTime: process.env.EXPIRATION_TIME_REDIS_CACHE || 86400,
};
