const Blacklist = require("../models/Blacklist");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models/index");
const { use } = require("bcrypt/promises");
const Volunteer = db.volunteer;
const blacklist = db.blacklist;

// For Getting User Details in MODAL
exports.getUser = async (req, res) => {
  const id = req.query.id;

  try {
    const user = await Volunteer.findOne({ _id: id }).select("-password");
    if (user) {
      res.status(200).send(user);
      return;
    } else {
      res
        .status(404)
        .send({ message: "Not Found.No Such User Request Pending" });
      return;
    }
  } catch (err) {
    res.status(500).send({ status: "error", error: err });
  }
  // Working Great and Tested for Error/Response
};
// For Approving User
exports.approveUser = (req, res) => {
  // Get _id of User to be approved
  const id = req.query.id;

  Volunteer.findOneAndUpdate(
    { _id: id },
    { $set: { level: 0, approved: true } },
    { new: true },
    (err, docs) => {
      if (err) {
        return res.status(500).send({ message: "Something Went Wrong!" });
      }
      if (docs) {
        return res.status(200).send({ message: "Approved with USER_ROLE" });
      } else return res.status(401).send({ message: "Something is not Right" });
    }
  );
  // Find User in TempData
  /*
  try {
    const user = await Volunteer.findById(id).select("-__v").exec();
    // If User is not Found
    if (!user) {
      // Send error Message
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
    // Save NewUser to Volunteer (Approved) Collection
    newUser.save((err, check) => {
      // If Some Error Exists
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // console.log(check);
    });

    // Delete User From tempCollection
    temp.deleteOne({ _id: id }, (err, resp) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
        return;
      }
      if (resp.deletedCount === 1) {
        res.status(200).send({ message: "Successfully Approved User" });
        return;
      } else {
        res.status(500).send({ message: "Looks Like we Hit A Snag!" });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }*/
};
// For Deleting User
exports.deleteUser = async (req, res) => {
  // Get _id of User to be approved
  const id = req.query.id;
  // Find User in TempData

  try {
    const user = await Volunteer.findById(id).select("-__v").exec();
    // If User is not Found
    if (!user) {
      // Send error Message
      res.status(404).send({ message: "No Such User Exist. Line  26" });
      return;
    }
    // console.log(user.uniqueKey);
    // Create New User in Volunteer with same User Details
    const newUser = new blacklist({
      uniqueKey: user.uniqueKey,
      email: user.email,
      password: user.password,
    });
    // Save NewUser to Volunteer (Approved) Collection
    newUser.save((err, check) => {
      // If Some Error Exists
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      // console.log(check);
    });

    // Delete User From tempCollection
    Volunteer.deleteOne({ _id: id }, (err, resp) => {
      if (err) {
        res.status(500).send({ message: err });
        console.log(err);
        return;
      }
      if (resp.deletedCount === 1) {
        res.status(200).send({ message: "User Request is Rejected." });
        return;
      } else {
        res.status(500).send({ message: "Looks Like we Hit A Snag!" });
        return;
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: err });
  }
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

exports.adminBoard = (req, res) => {
  // Check if Admin
  Volunteer.find({})
    .select("-password")
    .exec((err, user) => {
      if (err) {
        res.status(401).send({ message: err });
      }
      // Send TempData all documents
      res.send(user);
    });
  // res.send('ADmin Board');
};
exports.apiUpdate = (req, res) => {
  //Tested for Every Possible Scenario
  // console.log("I am here");
  // Get Role Update Value and id for Updation
  let level = 0;
  // Get Token from request
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "YOU ARE NOT AUTHORIZED" });
  }

  // If Token is Present Verify it
  jwt.verify(token, config.secret, (err, decoded) => {
    // Error in Decoding
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
  });

  // Find Level of Sender
  Volunteer.findById(req.userId)
    .select("-password")
    .exec((err, user) => {
      if (err) {
        return res.status(403).send({ message: err });
      } else if (!user) {
        return res
          .status(404)
          .send({ message: "NOT WELCOME. NO such User FOund" });
      } else if (
        user.level <= 0 ||
        user.level >= 6 ||
        req.body.value < user.level
      ) {
        return res
          .status(403)
          .send({ message: "YOU are not Allowed for this action" });
      } else if (req.body.value > user.level) {
        // console.log(req.body);
        Volunteer.findOneAndUpdate(
          { _id: req.body._id },
          { $set: { level: req.body.value, approved: true } },
          { new: true },
          (err, docs) => {
            if (err) {
              // console.log(err);
            } else {
              // console.log(docs);
              const arr = [
                "USER",
                "Admin",
                "State_Coordinator",
                "District_Coordinator",
                "Tehsil_Coordinator",
                "Block_Coordinator",
                "Village_Coordinator",
              ];
              const msg = `User is Changed to ` + `${arr[docs.level]}`;
              return res.status(200).send({ message: msg });
            }
          }
        );
      }
    });
};
// Search Form Data Controller
exports.searchData = (req, res) => {
  // Extract User Id and User Level from JWT
  let token = req.headers["x-access-token"];
  // No token Present
  if (!token) {
    return res.status(403).send({ message: "No Token Provided!" });
  }

  // Verify Token
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
  });

  let name1 = "",
    mobile1 = "",
    email1 = "",
    village1 = "",
    block1 = "",
    tehsil1 = "",
    district1 = "",
    state1 = "",
    country1 = "";
  if (req.body.name) name1 = req.body.name;
  if (req.body.mobile) mobile1 = req.body.mobile;
  if (req.body.email) email1 = req.body.email;
  if (req.body.village) village1 = req.body.village;
  if (req.body.block) block1 = req.body.block;
  if (req.body.tehsil) tehsil1 = req.body.tehsil;
  if (req.body.district) district1 = req.body.district;
  if (req.body.state) state1 = req.body.state;
  if (req.body.country) country1 = req.body.country;

  console.log(name1);
  console.log(mobile1);
  // Use Filter and Level Also

  Volunteer.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(401).send({ message: "NOT POSSIBLE" });
    }
    if (!user) {
      return res.status(403).send({ message: "No SUCH USER Exist" });
    }

    // If User is Admin , Send All Data2
    if (user.level === 1) {
      Volunteer.find({
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: village1,
        block: block1,
        tehsil: tehsil1,
        district: district1,
        state: state1,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of Volunteer
          res.send(userA);
        });
    }
    // If User if State_Coordinator . Send Data With Matching State
    else if (user.level === 2) {
      Volunteer.find({
        state: user.state,
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: village1,
        block: block1,
        tehsil: tehsil1,
        district: district1,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of
          res.send(userA);
        });
    }
    // If User is District Coordinator , Send Data with Matching District
    else if (user.level === 3) {
      Volunteer.find({
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: village1,
        block: block1,
        tehsil: tehsil1,
        state: user.state,
        district: user.district,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // If User is Tehsil Coordinator . Send Only Tehsil Data
    else if (user.level === 4) {
      Volunteer.find({
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: village1,
        block: block1,
        tehsil: user.tehsil,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // Block Coordinator .     Send Only Block Data
    else if (user.level === 5) {
      Volunteer.find({
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: village1,
        block: user.block,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // Send Only Village Data
    else if (user.level === 6) {
      Volunteer.find({
        firstName: name1,
        mobile: mobile1,
        email: email1,
        village: user.village,
      })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    } else {
      res
        .status(404)
        .send({ message: "NOT FOUND.SOMETHING IS WRONG WITH YOU." });
    }
  });
};

exports.moderatorBoard = (req, res) => {
  // User ID
  // Return Data according to User Level . Find User Level from JWT
  let token = req.headers["x-access-token"];
  // If There is no Token Present
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  // If Token is present , Verify It

  jwt.verify(token, config.secret, (err, decoded) => {
    // Error in Decoding
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
  });

  Volunteer.findById(req.userId).exec((err, user) => {
    if (err) {
      return res.status(401).send({ message: "NOT POSSIBLE" });
    }
    if (!user) {
      return res.status(403).send({ message: "No SUCH USER Exist" });
    }

    // const filter = {}
    // for (let val of filters) {
    //   filter[val] = user[val];
    // }
    // Volunteer.find(filter);

    // If User is Admin , Send All Data2
    if (user.level === 1) {
      Volunteer.find({})
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of Volunteer
          res.send(userA);
        });
    }
    // If User if State_Coordinator . Send Data With Matching State
    else if (user.level === 2) {
      Volunteer.find({ state: user.state })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of
          res.send(userA);
        });
    }
    // If User is District Coordinator , Send Data with Matching District
    else if (user.level === 3) {
      Volunteer.find({ state: user.state, district: user.district })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // If User is Tehsil Coordinator . Send Only Tehsil Data
    else if (user.level === 4) {
      Volunteer.find({ tehsil: user.tehsil })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // Block Coordinator .     Send Only Block Data
    else if (user.level === 5) {
      Volunteer.find({ block: user.block })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    }
    // Send Only Village Data
    else if (user.level === 6) {
      Volunteer.find({ village: user.village })
        .select("-password")
        .exec((err, userA) => {
          if (err) {
            res.status(401).send({ message: err });
          }
          // send array of all documents of TempData
          res.send(userA);
        });
    } else {
      res
        .status(404)
        .send({ message: "NOT FOUND.SOMETHING IS WRONG WITH YOU." });
    }
  });
  // Tested for every Scenario
};
