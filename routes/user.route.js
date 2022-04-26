const authJwt = require("../middleware/authjwt");
const controller = require("../controllers/user.controller");
const publicController = require("../controllers/public.controller");

// For appending Header to Request
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  // For Getting Public Content
  app.get("/api/test/all", controller.allAccess);
  // GET for User Details in MODAL for Particular ID from TempData : Moderator access allowed
  app.get("/api/user/getmod", [authJwt.verifyToken], controller.getUser);
  // GET user Board : All registered Volunteers
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  // GET all data from Volunteer : Return According to User.level
  app.get("/api/test/mod", [authJwt.verifyToken], controller.moderatorBoard);
  // POST approving user =>  Volunteer : Level : 0 , approved : true

  app.post("/api/approve", [authJwt.verifyToken], controller.approveUser);

  // POST delete User => Some unique data to Blacklist and then Delete from Volunteer

  app.post("/api/deleteUser", [authJwt.verifyToken], controller.deleteUser);
  // GET for all data in TempData
  // Return Admin Data
  app.get("/api/test/admin", [authJwt.verifyToken], controller.adminBoard);
  // Update Role_level to specified Role Level  and Approve to True
  app.post("/api/update", [authJwt.verifyToken], controller.apiUpdate);
  // app.post('/approvedecline', controller.approveDecline);

  app.get("/articles", publicController.Articles);
  // Get Announcements
  app.get("/announcements", publicController.Announcements);
  // Get Images Url and id
  app.get("/images", publicController.getImages);
  // Get Values
  app.get("/values", publicController.getValues);
  // Get Services
  app.get("/services",publicController.getServices);
};
