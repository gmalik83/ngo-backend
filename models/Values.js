const mongoose = require("mongoose");
const { Schema } = mongoose;

const ValuesSchema = new Schema({
  title: String,
  data: String,
  i: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("values", ValuesSchema);
