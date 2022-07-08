const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const replySchema = new Schema(
  {
    reply: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "People",
      required: true,
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);
const Reply = mongoose.model("Reply", replySchema);
module.exports = Reply;
