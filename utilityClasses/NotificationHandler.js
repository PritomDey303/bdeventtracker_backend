const { default: mongoose } = require("mongoose");
const QueryHandler = require("./QueryHandler");
const Notification = require("../models/notificationSchema");
const notificationObj = new QueryHandler(Notification);
class NotificationHandler {
  static async saveNotification(body, sender, receiver, event) {
    let notification = {
      body: body,
      sender: mongoose.Types.ObjectId(sender),
      event: mongoose.Types.ObjectId(event),
      receiver: mongoose.Types.ObjectId(receiver),
      read: false,
    };
    const notificationData = await notificationObj.insertData(notification);
    return notificationData;
  }
  static async deleteNotification(user_id, notificationId) {
    const userData = notificationObj.findDataById(notificationId);
    if (userData.receiver.toString() === user_id) {
      await notificationObj.deleteData(notificationId);
      return true;
    }
    return false;
  }
  static async deleteAllNotification(user_id) {
    const userData = notificationObj.findDataByQuery({
      receiver: user_id,
    });
    if (userData) {
      await notificationObj.deleteData(userData._id);
      return true;
    }
    return false;
  }
  //get all notifications of reciever sorted by date time
  static async getAllNotifications(user_id) {
    user_id = mongoose.Types.ObjectId(user_id);

    const notificationData = await notificationObj.findSortedData(
      {
        receiver: user_id,
      },
      "createdAt",
      -1
    );
    return notificationData;
  }

  //update all notifications of a reciever as read
  static async updateNotificationReadStatus(user_id) {
    user_id = mongoose.Types.ObjectId(user_id);
    const notificationData = await notificationObj.updateManyData(
      {
        receiver: mongoose.Types.ObjectId(user_id),
      },
      {
        read: true,
      }
    );
    return notificationData;
  }
  static async unreadNotificationCount(user_id) {
    user_id = mongoose.Types.ObjectId(user_id);
    const notificationData = await notificationObj.findData({
      receiver: user_id,
      read: false,
    });
    return notificationData.length;
  }
  static async deleteAllNotifications(user_id) {
    user_id = mongoose.Types.ObjectId(user_id);
    const notificationData = await notificationObj.deleteAllData({
      receiver: user_id,
    });
    return notificationData;
  }
  static async deleteNotificationById(notificationId, userid) {
    notificationId = mongoose.Types.ObjectId(notificationId);
    userid = mongoose.Types.ObjectId(userid);
    const notificationData = await notificationObj.deleteData({
      _id: notificationId,
      receiver: userid,
    });
    return notificationData;
  }
}

module.exports = NotificationHandler;
