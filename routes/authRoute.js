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
} = require("../controller/authController");
const {
  addPeopleValidators,
  addPeopleValidationHandler,
} = require("../middlewares/people/peopleValidator");
const router = express.Router();
console.log("routes");
//signup routes
router.post("/signup", addPeopleValidators, addPeopleValidationHandler, signup);
router.post("/verification", emailVerification);

//signin routes
router.post("/signin", addPeopleValidators, addPeopleValidationHandler, signin);
//signout routes
router.delete("/signout", checkLogin, signout);
//forgot password routes
router.post("/forgot_password", forgotPassword);
router.post("/reset_password/:token", resetPassword);
//change password routes
router.post("/change_password", checkLogin, changePassword);
module.exports = router;
