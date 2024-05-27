const redis = require("redis");

let redisClient;

(async () => {
  redisClient = redis.createClient();
  redisClient.on("error", (error) => console.error(error));

  const connected = await redisClient.connect(); // Redis will use port 6379, the default port.
  if (connected) {
    console.log("Connected to Redis");
  }
})();

module.exports = redisClient;
