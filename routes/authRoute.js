const express = require("express");
const {
  signup,
  emailVerification,
  signin,
  signout,
  forgotPassword,
  resetPassword,
  changePassword,
  checkLogin,
  checkLoginStatus,
} = require("../controller/authController");
const {
  addPeopleValidators,
  addPeopleValidationHandler,
} = require("../middlewares/people/peopleValidator");
const router = express.Router();
//signup routes
router.post("/signup", addPeopleValidators, addPeopleValidationHandler, signup);
router.post("/verification", emailVerification);

//signin routes
router.post("/signin", addPeopleValidators, addPeopleValidationHandler, signin);
//signout routes
router.get("/signout", checkLogin, signout);
//forgot password routes
router.post("/forgot_password", forgotPassword);
router.post("/reset_password/:token", resetPassword);
//change password routes
router.post("/change_password", checkLogin, changePassword);
//get log in user data
router.get("/user", checkLogin, checkLoginStatus);
module.exports = router;
