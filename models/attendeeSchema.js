const mongoose = require("mongoose");
const attendeeSchema = new mongoose.Schema(
  {
    event_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const Attendee = mongoose.model("Attendee", attendeeSchema);
module.exports = Attendee;
