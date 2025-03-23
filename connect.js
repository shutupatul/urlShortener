const mongoose = require("mongoose");
const redis = require("redis");

// Use local MongoDB if you're not using Atlas
const mongoURI = "mongodb://127.0.0.1:27017/short-url";

// Correct Redis connection
const redisClient = redis.createClient({ url: "redis://127.0.0.1:6380" });

redisClient.on("error", (err) => console.error("Redis Error:", err));

async function connectToMongoDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");

    await redisClient.connect();
    console.log("✅ Redis Connected");
  } catch (error) {
    console.error("❌ Connection Error:", error);
    process.exit(1); // Stop the app if DB fails
  }
}

module.exports = { connectToMongoDB, redisClient };
