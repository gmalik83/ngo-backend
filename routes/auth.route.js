const verifySignUp = require('../middleware/verifySignUp');
const controller = require('../controllers/auth.controller');
const verifyLogin = require('../middleware/verifyLogin');
module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  app.post(
    '/api/auth/register',
    [
      verifySignUp.checkEmailBlacklist,
      verifySignUp.checkEmailVolunteer,
      verifySignUp.checkDuplicateEmail,
      verifySignUp.checkRoleExisted,
    ],
    controller.register
  );
  app.post(
    '/api/auth/login',
    [verifyLogin.checkEmailBlacklist, verifyLogin.checkEmailTempData],
    controller.login
  );
};
