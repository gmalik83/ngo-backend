const mongoose = require("mongoose");
const { Schema } = mongoose;

const ArticleSchema = new Schema({
  url: String,
  title: String,
  text: String,
  link: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("article",ArticleSchema);