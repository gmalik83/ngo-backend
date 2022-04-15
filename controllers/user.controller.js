const Blacklist = require('../models/Blacklist');
const db = require('../models/index');
const { create } = require('../models/TempData');
const TempData = require('../models/TempData');
const temp = db.tempData;
const Volunteer = db.volunteer;
exports.getUser = async(req,res)=>{
  const id = req.query.id;

  try{
    const user = await temp.findOne({_id:id}).select('-password');
    if(user)
    {
      res.status(200).send(user);
    }
    else res.status(404).send({message:"Not Found"});

  }catch(err){
    res.send({status : 'error', error : err});
  }

}
exports.approveUser = async (req,res)=>{
  const id = req.query.id;
  res.send(`Getting Request to approve ${id}`);
}

exports.allAccess = (req, res) => {
  res.status(200).send('Public Content');
};
exports.userBoard = (req, res) => {
  // Get data from main Volunteer Collection
  // Name, Email , Mobile , Country State City
  Volunteer.find({})
    .select('-password')
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
    .select('-password')
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
    .select('-password')
    .exec((err, user) => {
      if (err) {
        res.status(401).send({ message: err });
      }
      res.send(user);
    });
};
