const mongoose = require("mongoose");
const { Schema } = mongoose;

const VolunteerSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  father: {
    type: String,
    required: true,
  },
  mother: {
    type: String,
    required: true,
  },
  village: {
    type: String,
    required: true,
  },
  postoffice: {
    type: String,
    required: true,
  },
  block: {
    type: String,
    required: true,
  },
  tehsil: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  special: String,
  graduation: String,
  xii: String,
  skill: String,
  profession: String,

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },

  address1: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  level: {
    type: Number,
    default: 0,
    min: 0,
    max: 6,
  },
  mobile: {
    type: String,
    required: true,
  },
  uniqueKey: {
    type: String,
    required: true,
    unique: true,
  },
});
module.exports = mongoose.model("volunteers", VolunteerSchema);
