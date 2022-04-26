const mongoose = require("mongoose");
const { Schema } = mongoose;

const PagesSchema = new Schema({
  heading: String,
  body: String,
  id:String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("pages", PagesSchema);
