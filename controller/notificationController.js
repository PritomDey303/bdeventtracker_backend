const NotificationHandler = require("../utilityClasses/NotificationHandler");

async function getAllNotifications(req, res, next) {
  try {
    //find notifications of user sorted by date
    const notifications = await NotificationHandler.getAllNotifications(
      req.user._id
    );

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

module.exports = {
  getAllNotifications,
  updateNotificationStatus,
  getUnreadNotificationCount,
};
