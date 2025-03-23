const shortid = require("shortid");
const URL = require("../models/url.js");

function isValidUrl(url) {
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/.*)?$/;
  return regex.test(url);
}

async function handleGenerateNewShortUrl(req, res, next) {
  try {
    let { longUrl, customAlias } = req.body;

    // Validate URL
    if (!longUrl || !isValidUrl(longUrl)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    // Ensure it has "http://" or "https://"
    if (!/^https?:\/\//.test(longUrl)) {
      longUrl = `https://${longUrl}`;
    }

    // If custom alias exists, validate it
    if (customAlias) {
      if (!/^[a-zA-Z0-9_-]+$/.test(customAlias)) {
        return res
          .status(400)
          .json({ error: "Custom alias must be alphanumeric." });
      }

      // Check if alias already exists
      const aliasExists = await URL.findOne({ shortId: customAlias });
      if (aliasExists) {
        return res.status(400).json({ error: "Custom alias already taken" });
      }
    }

    // Check if URL already exists in DB
    let existingUrl = await URL.findOne({ redirectURL: longUrl });
    if (existingUrl) {
      return res.json({
        shortUrl: `http://localhost:8001/urls/${existingUrl.shortId}`,
      });
    }

    // Generate unique ID if custom alias not provided
    const shortID = customAlias || shortid.generate();

    // Save new short URL in DB
    const newUrl = await URL.create({
      shortId: shortID,
      redirectURL: longUrl,
      visitHistory: [],
    });

    return res.json({
      shortUrl: `http://localhost:8001/urls/${newUrl.shortId}`,
    });
  } catch (error) {
    next(error);
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
