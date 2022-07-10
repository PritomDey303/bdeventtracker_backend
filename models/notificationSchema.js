const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const notificationSchema = new Schema(
  {
    body: {
      type: String,
      required: true,
    },
    sender: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    event: {
      type: ObjectId,
      ref: "Event",
      required: true,
    },
    receiver: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
