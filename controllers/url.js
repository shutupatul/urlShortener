const shortid = require("shortid");
const validUrl = require("valid-url");
const URL = require("../models/url.js");

async function handleGenerateNewShortUrl(req, res) {
  const { url } = req.body;

  // Validate URL
  if (!url || !validUrl.isUri(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const shortID = shortid();

  const newUrl = await URL.create({
    shortId: shortID,
    redirectURL: url,
    visitHistory: [],
  });

  return res.render("home", { id: newUrl.shortId });
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
