const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');
// const { volunteer } = require('../models/index');
const db = require('../models/index');
verifyToken = (req, res, next) => {
  // console.log("Request Received to Verify JWT")
  let token = req.headers['x-access-token'];
  // If There is no Token Present
  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }
  // If Token is present , Verify It

  jwt.verify(token, config.secret, (err, decoded) => {
    // Error in Decoding
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};
/*
isAdmin = (req, res, next) => {
  // console.log(req.userId);
  volunteer.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    // Find in Roles : returns an array =>user.roles
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'admin') {
            next();
            return;
          }
        }
        res.status(403).send({ message: 'Require Admin Role!' });
        return;
      }
    );
  });
};
isModerator = (req, res, next) => {
  // console.log(req.userId);
  Volunteer.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles },
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === 'moderator') {
            next();
            return;
          }
        }
        res.status(403).send({ message: 'Require Moderator Role!' });
        return;
      }
    );
  });
};*/
const authJwt = {
  verifyToken,
};
module.exports = authJwt;
