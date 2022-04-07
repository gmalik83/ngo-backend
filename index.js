const express = require('express');
const cors = require('cors');

const app = express();

const db = require('./models');
const Role = db.role;

// For Usuage of dot-env files
require('dotenv').config();

// Make Database Configuration
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

//Middlewares

// For CORS Policy
app.use(cors());
// Parse Request of Content-type - application/json
app.use(express.json());
// Parse Request of Content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

// Initial Function
function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count == 0) {
      new Role({
        name: 'user',
      }).save((err) => {
        if (err) console.log('error ', err);
        console.log("Added 'user' to Role Collection");
      });

      new Role({
        name: 'moderator',
      }).save((err) => {
        if (err) console.log('error ', err);
        console.log('Added Moderator to Role Collection');
      });
      new Role({
        name: 'admin',
      }).save((err) => {
        if (err) console.log('error ', err);
        console.log('Added Admin to Roles Collection');
      });
    }
  });
}

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/form', require('./routes/contact'));

// Simple Route for Checking
app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});
