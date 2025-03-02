const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
  source: {
    // id: { type: String, default: null },
    name: { type: String },
  },
  author: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  url: { type: String, required: true, unique: true },
  urlToImage: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  content: {
    type: String,
  },
  searchQuery: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("article", articleSchema);
