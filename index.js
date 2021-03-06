const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const routerContact = require('./routes/contact');


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

// Route for Contact Form API
app.post('/contact',routerContact);

// set PORT to run application
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is Running at port ${PORT}`);
});


