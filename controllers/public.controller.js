const Articles = require("../models/Articles");
const Announcements = require("../models/Announcements");
const Images = require("../models/Images");
const Values = require("../models/Values");
const Services = require("../models/Services");
const Page = require("../models/Page");

exports.Articles = async (req, res) => {
  const data = await Articles.find({});

  res.send(data);
};
exports.Announcements = async (req, res) => {
  try {
    const data = await Announcements.find({}).select("-_id");

    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
};
exports.getImages = async (req, res) => {
  try {
    const data = await Images.find({}).select("-_id");

    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
};
exports.getValues = async (req, res) => {
  try {
    const data = await Values.find({}).select("-_id");

    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
};
exports.getServices = async (req, res) => {
  try {
    const data = await Services.find({}).select("-_id");
    res.status(200).send(data);
  } catch (error) {
    res.status(404).send(error);
  }
};
exports.getPage = async (req, res) => {
  const Id = req.params.Id;
  try {
    const data = await Page.findOne({ id: Id }).select("-_id");
    if(data){
      res.status(200).send(data);
    }
    else {
      res.status(404).send({message:"This article does not exist"})
;    }
    
  } catch (error) {
    res.status(500).send(error);
  }
};
