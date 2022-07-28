const NotificationHandler = require("../utilityClasses/NotificationHandler");

async function getAllNotifications(req, res, next) {
  console.log("not");
  try {
    //find notifications of user sorted by date
    const notifications = await NotificationHandler.getAllNotifications(
      req.user._id
    );
    console.log(notifications);

    res.json({
      status: 200,
      message: "All notifications fetched successfully.",
      data: notifications,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: "Error in getting all notifications",
    });
  }
}

//////////////////////////
//update notification read status
//////////////////////////
async function updateNotificationStatus(req, res, next) {
  try {
    const notification = await NotificationHandler.updateNotificationReadStatus(
      req.user._id
    );
    res.json({
      status: 200,
      message: "Notification read status updated successfully.",
      data: notification,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: "Error in updating notification read status",
    });
  }
}

//////////////////////////
//get unread notification count
//////////////////////////
async function getUnreadNotificationCount(req, res, next) {
  try {
    const notificationCount = await NotificationHandler.unreadNotificationCount(
      req.user._id
    );
    res.json({
      status: 200,
      message: "Unread notification count fetched successfully.",
      data: notificationCount,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in getting unread notification count",
    });
  }
}
/////////////////////////////
//deleteNotifications
//////////////////////
async function deleteAllNotification(req, res, next) {
  try {
    const notification = await NotificationHandler.deleteAllNotification(
      req.user._id
    );
    res.json({
      status: 200,
      message: "All notifications deleted successfully.",
      data: notification,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in deleting all notifications",
    });
  }
}

async function deleteNotificationById(req, res, next) {
  try {
    const notification = await NotificationHandler.deleteNotificationById(
      req.params.notificationId,
      req.user._id
    );
    res.json({
      status: 200,
      message: "Notification deleted successfully.",
      data: notification,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in deleting notification",
    });
  }
}
module.exports = {
  getAllNotifications,
  updateNotificationStatus,
  getUnreadNotificationCount,
  deleteNotificationById,
  deleteAllNotification,
};
