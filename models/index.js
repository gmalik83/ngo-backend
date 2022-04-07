const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;
db.tempData = require('./TempData');
db.blacklist = require('./Blacklist');
db.volunteer = require('./Volunteers');

db.role = require('./role.model');
db.ROLES = ['user', 'admin', 'moderator'];
module.exports = db;
