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
  getFilteredEventData,
  getEventsByLatLong,
  getEventById,
  getEventsByUserId,
} = require("../controller/eventController");
const {
  addEventValidators,
  addEventValidationHandler,
} = require("../middlewares/event/eventValidators");

const router = express.Router();

//routes
router.post(
  "/create",
  checkLogin,
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  addEventValidators,
  addEventValidationHandler,
  eventCreate
);

router.get("/", getAllEvents);
router.get("/filter", getFilteredEventData);
router.get("/latlong", getEventsByLatLong);
router.get("/your-events/:id", getEventsByUserId);
router.post(
  "/update",
  checkLogin,
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  addEventValidators,
  addEventValidationHandler,
  updateEvent
);
router.get("/singleevent/:id", getEventById);

router.delete("/delete/:event_id", deleteEvent);
module.exports = router;
