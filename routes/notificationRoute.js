const express = require("express");

const { checkLogin } = require("../controller/authController");
const {
  getAllNotifications,

  updateNotificationStatus,
  getUnreadNotificationCount,
  deleteNotificationById,
} = require("../controller/notificationController");
const router = express.Router();

router.get("/", checkLogin, getAllNotifications);
router.put("/updatestatus", checkLogin, updateNotificationStatus);
router.get("/unreadcount", checkLogin, getUnreadNotificationCount);
router.delete("/delete/:notificationId", checkLogin, deleteNotificationById);
module.exports = router;
