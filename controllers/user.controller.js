const Blacklist = require("../models/Blacklist");
const db = require("../models/index");
const { create } = require("../models/TempData");
const TempData = require("../models/TempData");
const temp = db.tempData;
const Volunteer = db.volunteer;

// For Getting User Details in MODAL
exports.getUser = async (req, res) => {
  const id =req.query.id;

  try {
    const user = await temp.findOne({ _id: id }).select("-password");
    if (user) {
      res.status(200).send(user);
      return;
    } else {
      res.status(404).send({ message: "Not Found" });
      return;
    }
  } catch (err) {
    res.status(500).send({ status: "error", error: err });
  }
};
// For Approving User
exports.approveUser = async (req, res) => {
  const id = req.query.id;
  // Find User in TempData

  try {
    const user = await temp.findById(id).select("-__v").exec();
    // If User is not Found
    if (!user) {
      res.status(404).send({ message: "No Such User Exist. Line  26" });
      return;
    }
    // Create New User in Volunteer with same User Details
    const newUser = new Volunteer({
      name: user.name,
      email: user.email,
      password: user.password,
      country: user.country,
      state: user.state,
      city: user.city,
      address: user.address,
      pincode: user.pincode,
      mobile: user.mobile,
      uniqueKey: user.uniqueKey,
      roles: [user.roles],
    });
    // Save NewUser to Volunteer Collection
    newUser.save((err, check) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      console.log(check);
    });

    // Delete User From tempCollection
    temp.deleteOne({ _id: id }, (err, res) => {
      if (err) {
        console.log(err);
      }
      console.log(res);
    });

    res.send("This is Good");
  } catch (err) {
    console.log(err);
  }

  /*
  // Send in Volunteer 
  Volunteer.create(user,(err,pass)=>{
    if(err)
    console.log(err);
    res.send(pass);
    return ;
  })
  // Delete from Temp Data
  temp.deleteOne({_id:id},(err,msg)=>{
    if(err)
    console.log(err);
    res.send(msg);
    return;
  })

  res.send("Ok"); */
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content");
};
exports.userBoard = (req, res) => {
  // Get data from main Volunteer Collection
  // Name, Email , Mobile , Country State City
  Volunteer.find({})
    .select("-password")
    .exec((err, user) => {
      if (err) {
        res.status(401).send({ message: err });
      }

      res.send(user);
    });
};
/*exports.approveDecline = (req, res) => {
  var input = req.body; //status, application.
  var loggedInUser = req.user;
  TempData.find({ _id: input.application }, (err, user) => {
    if (input.status === 'approve') {
      Volunteer.create(user, (err, created) => {
        if (!err && created) {
          res.status(200).send({ message: 'User Successfully approved' });
        } else {
          res
            .status(404)
            .send({ message: 'Some error occured while approving the user' });
        }
      });
    } else if (input.status === 'declined') {
      Blacklist.create(user, (err, created) => {
        if (!err && created) {
          res
            .status(200)
            .send({ message: 'Application Successfully rejected' });
        } else {
          res.status(404).send({
            message: 'Some error occured while rejecting the application',
          });
        }
      });
    }
  });
};
*/
exports.adminBoard = (req, res) => {
  // Check if Admin
  TempData.find({})
    .select("-password")
    .exec((err, user) => {
      if (err) {
        res.status(401).send({ message: err });
      }
      res.send(user);
    });
  // res.send('ADmin Board');
};
exports.moderatorBoard = (req, res) => {
  TempData.find({})
    .select("-password")
    .exec((err, user) => {
      if (err) {
        res.status(401).send({ message: err });
      }
      res.send(user);
    });
};
