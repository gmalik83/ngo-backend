const express = require('express');
const routerContact = express.Router();

const Contact = require('../models/Contact');

const { body, validationResult } = require('express-validator');

routerContact.post(
  '/contact',
  [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('message', 'Enter a valid message').isLength({ min: 3 }),
  ],
  async (req, res) => {
    // If there are errors , return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      // Check if Request is already made
      console.log(req.body);
      let user = await Contact.findOne({ email: req.body.email });

      if (user) {
        return res
          .status(400)
          .json({ error: 'We have already received your Query' });
      }
      user = Contact.create({
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
      });
      const data = {
        user: {
          id: user.id,
        },
      };

      res.json(user);
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);
module.exports = routerContact;
