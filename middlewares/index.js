const redisClient = require("../utils/redisConn");

const cachedData = async (req, res, next) => {
  try {
    const species = req?.params?.species;
    let results;

    const cachedData = await redisClient.get(species);
    if (cachedData) {
      results = JSON.parse(cachedData);
      res.send({
        fromCache: true,
        data: results,
      });
    } else {
      next();
    }
  } catch (error) {
    console.error(error);
    res.status(404);
  }
};

module.exports = cachedData;
