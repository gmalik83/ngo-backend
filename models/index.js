const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
// db.tempData = require('./TempData');
db.blacklist = require("./Blacklist");
db.volunteer = require("./Volunteers");

// db.role = require('./role.model');
db.ROLES = [
  "admin",
  "state_coordinator",
  "district_coordinator",
  "city_coordinator",
  "tehsil_coordinator",
  "block_coordinator",
  "village_coordinator",
];
module.exports = db;
