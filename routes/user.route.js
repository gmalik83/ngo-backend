const authJwt = require("../middleware/authjwt");
const controller = require("../controllers/user.controller");

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
  app.get(
    "/api/user/getmod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.getUser
  );
  // GET user Board : All registered Volunteers
  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);
  // GET all data from TempData
  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );
  // POST approving user => tempData -> Volunteer
  app.post("/api/approve", controller.approveUser);
  // POST delete User => tempData -> Volunteer
  app.post("/api/deleteUser", controller.deleteUser);
  // GET for all data in TempData
  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
  // app.post('/approvedecline', controller.approveDecline);
};
