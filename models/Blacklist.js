const mongoose = require('mongoose');
const { Schema } = mongoose;

const BlacklistSchema = new Schema({
  uniqueKey: {
    type: String,
    required: true,
    unique:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  }

});

module.exports = mongoose.model('blacklist', BlacklistSchema);
