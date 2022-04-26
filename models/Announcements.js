const mongoose = require("mongoose");
const { Schema } = mongoose;

const AnnouncementSchema = new Schema({
  url: String,
  heading: String,
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("announcement", AnnouncementSchema);
