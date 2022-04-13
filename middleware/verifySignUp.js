// Check if User Already in Blacklist or TempData or Volunteer
// Check if Role is Legal or Not
const db = require('../models/index');
const ROLES = db.ROLES;
const TempData = db.tempData;
const Blacklist = db.blacklist;
const Volunteer = db.volunteer;
// const Blacklist = db.blacklist;
// const Volunteer = db.volunteer;
checkEmailBlacklist = (req, res, next) => {
  Blacklist.findOne({ email: req.body.email }).exec((err, user) => {
    // If any Error Present
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User Exist in Blacklist Database
    if (user) {
      res
        .status(400)
        .send({ message: 'You have been blacklisted. VerifySignUp' });
      return;
    }
    next();
  });
};
checkEmailVolunteer = (req, res, next) => {
  Volunteer.findOne({ email: req.body.email }).exec((err, user) => {
    // If Any Error Present
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User Exist in Databse
    if (user) {
      res.status(400).send({ message: 'You are already a Volunteer' });
      return;
    }
    next();
  });
};

checkDuplicateEmail = (req, res, next) => {
  // Check for Email in Blacklist
  /*Blacklist.findOne({ email: req.body.email }).exec((err, user) => {
    // If there is any Error present
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User Exists
    if (user) {
      res.status(400).send({ message: 'You have been Blacklisted.' });
      return;
    }
    */

  // Check for Email in TempData
  TempData.findOne({ email: req.body.email }).exec((err, user) => {
    // If Any Error Present
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User Exists in Temp Database
    if (user) {
      res.status(400).send({ message: 'You have already submitted. Line 35' });
      return;
    }

    /*  // Check for EMail in Volunteer Database
      Volunteer.findOne({ email: req.body.email }).exec((err, user) => {
        // If There is Error Present
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        // If User Exists in Final Database
        if (user) {
          res.status(400).send({ message: 'Already Registered' });
          return;
        }
        */

    next();
  });
  // });
  // });
};
// Check if Roles Exist
checkRoleExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }
  next();
};

const verifySignUp = {
  checkEmailBlacklist,
  checkEmailVolunteer,
  checkDuplicateEmail,
  checkRoleExisted,
};
module.exports = verifySignUp;
