const express = require("express");
const { signup, emailVerification } = require("../controller/authController");
const {
  addPeopleValidators,
  addPeopleValidationHandler,
} = require("../middlewares/people/peopleValidator");
const router = express.Router();

router.post("/signup", addPeopleValidators, addPeopleValidationHandler, signup);
router.get("/verification/:token", emailVerification);

module.exports = router;
