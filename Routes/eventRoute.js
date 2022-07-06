const express = require("express");
const {
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate,
} = require("../controller/eventController");

const router = express.Router();

//routes
router.post(
  "/create",
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate
);
module.exports = router;
