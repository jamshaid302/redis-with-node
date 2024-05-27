const express = require("express");
const app = express();
const redisClient = require("./utils/redisConn");
const cachedData = require("./middlewares");
const { fetchApiData } = require("./utils/helper");

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/fish/:species", cachedData, getSpeciesData);

async function getSpeciesData(req, res) {
  try {
    const species = req?.params?.species;
    let results;

    // clear the cache
    // await redisClient.del(species);

    results = await fetchApiData(species);
    if (results?.length === 0) {
      throw "API returned an empty array";
    }

    await redisClient.set(species, JSON.stringify(results), {
      EX: 3600, // 3600 seconds
      NX: true, // Only set the key if it does not already exist in redis
    });

    return res.send({
      fromCache: false,
      data: results,
    });
  } catch (error) {
    return res.status(404).send({ error: error.message });
  }
}

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
