const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  shortId: { type: String, unique: true, required: true, index: true },
  redirectURL: { type: String, required: true },
  visitHistory: [
    {
      timeStamp: { type: Date, default: Date.now },
      ip: String,
      userAgent: String,
    },
  ],
});

module.exports = mongoose.model("URL", urlSchema);
