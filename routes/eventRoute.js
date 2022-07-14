const express = require("express");
const { checkLogin } = require("../controller/authController");
const {
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate,
  getFilteredEvents,
  updateEvent,
  deleteEvent,
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

router.get("/", getAllEvents);
router.post("/filteredevent", getFilteredEvents);
router.post(
  "/update",
  checkLogin,
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  addEventValidators,
  addEventValidationHandler,
  updateEvent
);

router.delete("/delete/:event_id", checkLogin, deleteEvent);
module.exports = router;
