const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const db = require('./models/index');
// For Role Model
const Role = db.role;

// For Usuage of dot-env files
require('dotenv').config();

//Middlewares

// For CORS Policy
app.use(cors());
// Parse Request of Content-type - application/json
app.use(express.json());
// Parse Request of Content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
// Taking URI for Database Connection From ENV file
const uri = process.env.MONGO_URI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    initial();
  })
  .catch((err) => {
    console.error('Error connecting to mongo', err);
  });

// Route for Checking Connection
app.get('/', (req, res) => {
  res.json({ message: 'Application successfully running' });
});

// // Available Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/form', require('./routes/contact'));
require('./routes/auth.route')(app);
require('./routes/user.route')(app);


// set PORT to run application
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});

// Initial Function : Adding Role in Role.model if it is empty
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
