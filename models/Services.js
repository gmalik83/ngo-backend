const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServicesSchema = new Schema({
  src: String,
  title: String,
  body: String,
  link: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("services", ServicesSchema);
