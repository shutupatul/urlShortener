const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB, redisClient } = require("./connect");
const urlRoute = require("./routes/url");
const { restrictToLoggedinUserOnly } = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const rateLimiter = require("./middlewares/rateLimiter");
const logger = require("./middlewares/logger");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const URL = require("./models/url");
const helmet = require("helmet");
const cors = require("cors");

const app = express();
app.use(helmet());
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("MongoDB Connected")
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({ origin: "*" }));

app.use(errorHandler);

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request for ${req.url}`);
  next();
});

app.use("/url", restrictToLoggedinUserOnly, rateLimiter, urlRoute);
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/", staticRoute);
app.use("/user", userRoute);

app.get("/urls/:shortId", async (req, res) => {
  try {
    const shortId = req.params.shortId;

    let cachedURL = await redisClient.get(shortId);
    if (cachedURL) {
      console.log("Cache Hit! Redirecting...");
      return res.redirect(cachedURL);
    }

    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timeStamp: Date.now(),
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          },
        },
      },
      { new: true }
    );

    if (!entry) return res.status(404).json({ error: "Short URL not found" });

    await redisClient.setEx(shortId, 86400, entry.redirectURL);
    console.log("Cache Miss! Stored in Redis.");

    res.redirect(entry.redirectURL);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
