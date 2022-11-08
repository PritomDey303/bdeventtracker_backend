const mongoose = require("mongoose");
const eventSchema = new mongoose.Schema(
  {
    event_name: {
      type: String,
      required: true,
      trim: true,
    },
    event_date: {
      type: String,
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
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true },
    },

    event_description: {
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
      //enum: ["offline", "online", "both"],
    },
    event_category: {
      type: String,
      required: true,
      trim: true,
    },
    event_organizer: {
      type: String,
      required: true,
      trim: true,
    },
    event_organizer_mobile: {
      type: String,
      required: true,
      trim: true,
    },
    event_organizer_email: {
      type: String,
      required: true,
      trim: true,
    },
    event_organizer_facebook: {
      type: String,
      trim: true,
    },
    event_organizer_website: {
      type: String,
      trim: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
eventSchema.index({ location: "2dsphere" });
const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

//event date auto generate
