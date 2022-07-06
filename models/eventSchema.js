const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
      trim: true,
    },
    event_date: {
      type: Date,
      required: true,
      trim: true,
    },
    event_time: {
      type: String,
      required: true,
      trim: true,
    },
    event_location: {
      type: Array,
      required: true,
    },
    event_Description: {
      type: String,
      required: true,
      trim: true,
    },
    event_banner_image: {
      type: Array,
      required: true,
    },
    event_type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", eventSchema);
