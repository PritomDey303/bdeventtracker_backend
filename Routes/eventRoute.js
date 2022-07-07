const express = require("express");
const {
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate,
  getAllEvents,
} = require("../controller/eventController");
const {
  addEventValidators,
  addEventValidationHandler,
} = require("../middlewares/event/eventValidators");

const router = express.Router();

//routes
router.post(
  "/create",
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  addEventValidators,
  addEventValidationHandler,
  eventCreate
);

module.exports = router;
