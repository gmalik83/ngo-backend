const express = require('express');
const router = express.Router();
const Volunteers = require('../models/Volunteers');
const Blacklist = require('../models/Blacklist');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const TempData = require('../models/TempData');
const generateToken = require('../utils/generateToken');

const db = require('../models');
const ROLES = db.ROLES;
// const User = db.user;
// Create a User using POST "/api/auth/register"  . No Login Required

router.post(
  '/register',
  [
    body('name', 'Enter a Valid Name').isLength({ min: 3 }),
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({
      min: 5,
    }),
    body('country', 'Choose a Valid Country').isLength({ min: 3 }),
    body('mobile', 'Enter A Valid Mobile Number').isLength({ min: 10 }),
  ],
  async (req, res) => {
    // If there are errors , return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }

    try {
      //Check if User is already Denied entry :Blacklist Database
      // Generate Unique Key from Name And Mobile
      let key = req.body.name + req.body.mobile;
      let email = req.body.email;
      // Check if user Blacklisted
      let checkUser = await Blacklist.findOne({ email });
      // If CheckUser is not NULL => User already denied entry
      if (checkUser) {
        return res
          .status(400)
          .json({ message: 'Sorry.Your application have already been denied' });
      }
      // Check Data in Temp Volunteer Database => Request in Process
      checkUser = await TempData.findOne({ email });
      if (checkUser) {
        return res.status(400).json({
          message: 'You have already Applied.Login with valid details',
        });
      }

      // Check whether user already exist and approved
      let user = await Volunteers.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ message: 'Sorry. This User Already Exist' });
      }
      if (req.body.roles) {
        for (let i = 0; i < req.body.roles.length; i++) {
          if (!ROLES.includes(req.body.roles[i])) {
            return res
              .status(400)
              .json({
                message: `Failed! Role ${req.body.roles[i]} does not exist!`,
              });
          }
        }
      }
      // Generate Salt for Password of New User
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // create new user in Temporary Database
      user = await TempData.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        address: req.body.address,
        pincode: req.body.pincode,
        mobile: req.body.mobile,
        uniqueKey: key,
      });
      const data = {
        user: {
          _id: user._id,
          name: user.name,
          mobile: user.mobile,
          token: generateToken(user._id),
        },
      };
      // const authtoken = jwt.sign(data, JWT_SECRET);

      res.json({ data });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    // => User is not logged in
    let success = false;
    // If errors , return bad request and Errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      // let key = name + mobile;
      // Check User in Blacklist Database
      let user = await Blacklist.findOne({ email });
      if (user) {
        // Check For Correct password
        let passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          success = false;
          return res.status(400).json({
            success,
            error: 'Please Try to Login With Valid Creditionals',
          });
        }
        let data = {
          user: {
            name: user.name,
            _id: user._id,
            token: generateToken(user._id),
          },
        };
        return res
          .status(400)
          .json({ error: 'Your Application Has been Denied', data });
      }
      // Check If User Exist or not in Temp Database : Exist=> Return Status Of User
      user = await TempData.findOne({ email });
      if (user) {
        let passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
          success = false;
          return res.status(400).json({
            success,
            error: 'Please Try to Login With Valid Creditionals',
          });
        }
        let data = {
          user: {
            _id: user._id,
            name: user.name,
            token: generateToken(user._id),
          },
        };
        return res
          .status(200)
          .json({ msg: 'Your Application is under Process.', data });
      }
      user = await Volunteers.findOne({ email });
      if (!user) {
        success = false;
        return res
          .status(400)
          .json({ success, error: 'Please Login With valid Creditionals' });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({
          success,
          error: 'Please Try to login with Valid Creditionals',
        });
      }
      const data = {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        },
      };
      // const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, data, user });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal Server Error');
    }
  }
);

module.exports = router;
