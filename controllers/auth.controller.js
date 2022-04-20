const config = require("../config/auth.config");
const db = require("../models/index");

const Volunteer = db.volunteer;


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// It will Verify Using VerifySignup middleware
exports.register = (req, res) => {
  console.log(req.body);
  let key =
    req.body.firstname.trim() +
    req.body.mobile.trim() +
    req.body.lastname.trim();
  const newUser = new Volunteer({
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    age: req.body.age,
    father: req.body.father,
    mother: req.body.mother,
    village: req.body.hno,
    postoffice: req.body.postoffice,
    block: req.body.block,
    tehsil: req.body.tehsil,
    district: req.body.district,
    state: req.body.state,
    country: req.body.country,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    address1: req.body.address1,
    special: req.body.special,
    graduation: req.body.graduation,
    xii: req.body.xii,
    skill: req.body.skill,
    service: req.body.service,
    pincode: req.body.pincode,
    mobile: req.body.mobile,
    uniqueKey: key,
  });

  newUser.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user._id) {
      res.send({ message: "User was registered successfully! ROLE:USER" });
    } else {
      res.status(403).send({ message: "Registration Failed:!" });
    }
  });
};

exports.login = (req, res) => {
  console.log(req.body);

  Volunteer.findOne({
    email: req.body.email,
  })
    .exec((err, user) => {
      if (err) {
        console.log(err);
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({
          message:
            "Invalid Details .Login Component.User Not found in Volunteer",
        });
      }
      let passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid PASSWORD or Email!",
        });
      }
      // Sign Token for returning to user
      let token = jwt.sign({ id: user._id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });
      let authorities;
      console.log(user.level);
      switch(user.level)
      {
        case 1: authorities = "ADMIN";
                break;
        case 2 : authorities = "STATE_COORDINATOR";
                break;
        case 3: authorities = "DISTRICT_COORDINATOR";
                break;
        case 4 : authorities = "TEHSIL_COORDINATOR";
                break;
        case 5: authorities = "BLOCK_COORDINATOR";
                break;
        case 6: authorities = "VILLAGE_COORDINATOR";
              break;
        default : authorities = "USER";
      }
      
      console.log(user);
      res.status(200).send({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        father: user.father,
        mother: user.mother,
        village: user.village,
        postoffice: user.postoffice,
        block: user.block,
        tehsil: user.tehsil,
        district: user.district,
        state: user.state,
        country: user.country,
        email: user.email,
        address1: user.address1,
        special: user.special,
        graduation: user.graduation,
        xii: user.xii,
        skill: user.skill,
        service: user.service,
        pincode: user.pincode,
        mobile: req.body.mobile,
        authorities:authorities,
        level : user.level,
        accessToken:token
      });
    });
};
