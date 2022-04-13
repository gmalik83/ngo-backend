const bcrypt = require('bcryptjs');
const db = require('../models/index');
const verifySignUp = require('./verifySignUp');
const TempData = db.tempData;
const Blacklist = db.blacklist;

checkEmailBlacklist = (req, res, next) => {
  Blacklist.findOne({ email: req.body.email }).exec((err, user) => {
    // If there are any Errors
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User exist in Blacklist Database
    if (user) {
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        // If Password does not match
        res.status(401).send({
          message: 'Invalid Password Or EMail VerifyLogin.js. Line 24',
        });
        return;
      } else if (passwordIsValid) {
        res
          .status(400)
          .send({
            message: 'You have been Blacklisted.Verify Login . Line 31',
          });
        return;
      }
    }
    next();
  });
};
checkEmailTempData = (req, res, next) => {
  TempData.findOne({ email: req.body.email }).exec((err, user) => {
    // If there are any Errors
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // If User exist in Blacklist Database
    if (user) {
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        res.status(401).send({
          message: 'Invalid Password Or EMail VerifyLogin.js Line 52',
        });
        return;
      }
      res.status(400).send({ message: 'Your Request is Under Process' });
      return;
    }
    next();
  });
};
const verifyLogin = {
  checkEmailBlacklist,
  checkEmailTempData,
};
module.exports = verifyLogin;
