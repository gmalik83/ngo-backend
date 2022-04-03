const mongoose = require('mongoose');

const mongoURI = `mongodb+srv://gmalik83:${process.env.MONGO_PASS}@mern.5wecr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const connectToMongo = () => {
  mongoose.connect(
    mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    () => {
      console.log('Connected to DB Successfully.');
    }
  );
};

module.exports = connectToMongo;
