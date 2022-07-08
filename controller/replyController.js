const Reply = require("../models/replySchema");

const QueryHandler = require("../utilityClasses/QueryHandler");

/////////////////////

const replyHandler = new QueryHandler(Reply);
const mongoose = require("mongoose");
///////////////////
////post reply on comment
///////////////////
async function postReply(req, res) {
  try {
    const { reply, comment_id } = req.body;
    const user_id = req.user._id;
    const replyData = {
      reply,
      user: mongoose.Types.ObjectId(user_id),
      comment: mongoose.Types.ObjectId(comment_id),
    };
    const replyObj = await replyHandler.insertData(replyData);
    res.status(200).json({
      message: "Reply added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "error adding reply",
      error,
    });
  }
}

///////////////////
////get all replies on comment
///////////////////
async function getAllReplies(req, res) {
  try {
    const comment_id = req.params.comment_id;
    const replies = await replyHandler.findSortedData(
      { comment: mongoose.Types.ObjectId(comment_id) },
      "createdAt",
      -1
    );
    res.status(200).json({
      status: 200,
      message: "success",
      data: replies,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "error getting replies",
    });
  }
}

///////////////////
////delete reply on comment by reply owner or comment owner
///////////////////
async function deleteReply(req, res) {
  try {
    const reply_id = req.params.reply_id;
    const user_id = req.user._id;
    const reply = await replyHandler.findData({
      _id: mongoose.Types.ObjectId(reply_id),
    });
    if (reply.user.toString() === user_id.toString()) {
      await replyHandler.deleteData(reply_id);
      res.status(200).json({
        message: "Reply deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "You are not authorized to delete this reply",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error deleting reply",
      error,
    });
  }
}

module.exports = {
  postReply,
  getAllReplies,
  deleteReply,
};
