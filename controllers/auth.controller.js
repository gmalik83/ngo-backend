const config = require('../config/auth.config');
const db = require('../models/index');
const Blacklist = db.blacklist;
const TempData = db.tempData;
const Volunteer = db.volunteer;
const Role = db.role;

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// It will Verify Using VerifySignup middleware
exports.register = (req, res) => {
  const user = new TempData({
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    country: req.body.country,
    state: req.body.state,
    city: req.body.city,
    address: req.body.address,
    mobile: req.body.mobile,
  });
  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
          }
          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: 'User was registered successfully!' });
          });
        }
      );
    } else {
      Role.findOne({ name: 'user' }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: 'User was registered successfully!' });
        });
      });
    }
  });
};

exports.login = (req, res) => {
  // Check in Blacklist
  Blacklist.findOne({ email: req.body.email })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res
          .status(400)
          .send({ message: 'You have been Blacklisted.Login Component' });
      }
    });
  TempData.findOne({ email: req.body.email })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (user) {
        res
          .status(400)
          .send({ message: 'Your Request is Under Process.Login Component' });
      }
    });
  Volunteer.findOne({
    email: req.body.email,
  })
    .populate('roles', '-__v')
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res
          .status(404)
          .send({ message: 'Invalid Details.Login Component' });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: 'Invalid PASSWORD or Email!',
        });
      }
      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      let authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push('ROLE_' + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        name: user.name,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
