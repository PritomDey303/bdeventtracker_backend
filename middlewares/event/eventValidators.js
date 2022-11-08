const { check, validationResult } = require("express-validator");
const CloudinaryUploader = require("../../utilityClasses/CloudinaryUploader");

const addEventValidators = [
  check("event_name")
    .isLength({ min: 1 })
    .withMessage("Event_name is required")

    .trim()
    .optional(),
  check("event_date")
    .isDate({ format: "DD/MM/YYYY" })
    .withMessage("Invalid date")
    .withMessage("Invalid date")
    .optional(),
  check("event_time")
    .isLength({ min: 1 })
    .withMessage("Event_time is required")
    .trim()
    .optional(),
  check("event_location")
    .isLength()
    .withMessage("Event_location is required")
    .optional(),
  check("event_description")
    .isLength({ min: 10 })
    .withMessage("Event_description must be atleast 10 characters long")
    .trim()
    .optional(),
  check("event_banner_image")
    .isArray()
    .withMessage("Event_banner_image is required")
    .optional(),
  check("event_type")
    .isLength({ min: 1 })
    .withMessage("Event_type is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("Event type must not contain anything other than alphabet")
    .trim()
    .optional(),
  check("event_organizer")
    .isLength({ min: 1 })
    .withMessage("Event_organizer is required")
    .trim()
    .optional(),
  check("event_organizer_mobile")
    .matches(/^(?:(?:\+|00)88|01)?(?:\d{11}|\d{13})$/gm)
    .withMessage("Invalid mobile number")
    .trim()
    .optional(),
  check("event_organizer_email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .optional(),
  check("event_organizer_facebook")
    .isURL()
    .withMessage("Invalid facebook url")
    .trim()
    .optional(),
  check("event_organizer_website")
    .isURL()
    .withMessage("Invalid website url")
    .trim()
    .optional(),
];

const addEventValidationHandler = async function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();
  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    const cloudinaryObj = new CloudinaryUploader();
    const info = await cloudinaryObj.deleteImages(req.eventBannerImage);
    return res.json({
      status: 400,
      message: mappedErrors,
    });
  }
};

module.exports = {
  addEventValidators,
  addEventValidationHandler,
};
