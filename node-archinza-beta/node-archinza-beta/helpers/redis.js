const redis = require("redis");
const logger = require("../logger/info_logger");
const config = require("../config/config");

const redisClient = redis.createClient({
  url: `redis://${config.redis_host}:${config.redis_port}`,
  password: config.redis_access_token,
});

redisClient.on("error", (err) => {
  logger.error("Redis Client Error", err);
});

redisClient.on("connect", () => {
  logger.info("Redis connected");
});

(async () => {
  await redisClient.connect();
})();

module.exports = redisClient;
