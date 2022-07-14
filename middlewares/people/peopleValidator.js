// external imports
const { check, validationResult } = require("express-validator");

// internal imports

// add People
const addPeopleValidators = [
  check("name")
    .isLength({ min: 1 })
    .withMessage("Name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Name must not contain anything other than alphabet")
    .trim()
    .optional(),
  check("email").isEmail().withMessage("Invalid email address").trim(),

  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long & should contain at least 1 lowercase, 1 uppercase, 1 number & 1 symbol"
    ),
];

const addPeopleValidationHandler = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    return res.json({
      status: 400,
      message: mappedErrors,
    });
  }
};

module.exports = {
  addPeopleValidators,
  addPeopleValidationHandler,
};
