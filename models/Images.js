const mongoose = require("mongoose");
const { Schema } = mongoose;

const ImagesSchema = new Schema({
  src: String,
  alt: String,
  i: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("images", ImagesSchema);
