const shortid = require("shortid");
const validUrl = require("valid-url");
const URL = require("../models/url.js");

function isValidUrl(url) {
  const regex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:[0-9]+)?(\/.*)?$/;
  return regex.test(url);
}

async function handleGenerateNewShortUrl(req, res, next) {
  try {
    const { url, customAlias } = req.body;

    if (!url || !isValidUrl(url)) {
      return res.status(400).json({ error: "Invalid URL format" });
    }

    let shortID = customAlias || shortid();

    const existingUrl = await URL.findOne({ shortId: shortID });
    if (existingUrl) {
      return res.status(400).json({ error: "Custom alias already taken" });
    }

    const newUrl = await URL.create({
      shortId: shortID,
      redirectURL: url,
      visitHistory: [],
    });

    return res.render("home", { id: newUrl.shortId });
  } catch (error) {
    next(error);
  }
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortUrl,
  handleGetAnalytics,
};
