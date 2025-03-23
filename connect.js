const mongoose = require("mongoose");
const redis = require("redis");

const mongoURI = "mongodb://localhost:27017/short-url";
const redisClient = redis.createClient({ port: 6380 });

redisClient.on("error", (err) => console.error("Redis Error:", err));

async function connectToMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");

    // Connect to Redis
    await redisClient.connect();
    console.log("Redis Connected");
  } catch (error) {
    console.error("Connection Error:", error);
  }
}

module.exports = { connectToMongoDB, redisClient };
