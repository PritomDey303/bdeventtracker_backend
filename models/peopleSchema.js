const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const peopleSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    accountType: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const People = mongoose.model("people", peopleSchema);

module.exports = People;
