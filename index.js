const express = require("express");
const path = require("path");
const { connectToMongoDB, redisClient } = require("./connect");
const urlRoute = require("./routes/url");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./middlewares/logger");
const staticRoute = require("./routes/staticRouter");
const { timeStamp } = require("console");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

app.use(errorHandler);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/url", urlRoute);

app.use("/", staticRoute);

app.get("/urls/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    // Check Redis cache first
    const cachedURL = await redisClient.get(shortId);
    if (cachedURL) {
      console.log("Cache Hit! Redirecting...");
      return res.redirect(cachedURL);
    }

    // If not in cache, check MongoDB
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timeStamp: Date.now() } } },
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    // Store in Redis for future requests
    await redisClient.set(shortId, entry.redirectURL);

    console.log("Cache Miss! Storing in Redis...");
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Error redirecting:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server statrted at PORT: ${PORT}`));
