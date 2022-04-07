const mongoose = require('mongoose');
const { Schema } = mongoose;

const Roles = new Schema({
  name: String,
});

module.exports = mongoose.model('Role', Roles);
