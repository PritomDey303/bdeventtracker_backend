const mongoose = require("mongoose");
const Comment = require("../models/commentSchema");
const Event = require("../models/eventSchema");
const Reply = require("../models/replySchema");
const QueryHandler = require("../utilityClasses/QueryHandler");
const commentHanlder = new QueryHandler(Comment);
const eventHanlder = new QueryHandler(Event);
const replyHandler = new QueryHandler(Reply);
/////////////////
//post comment on event
/////////////////
async function postComment(req, res) {
  try {
    const { comment } = req.body;
    const event_id = req.params.event_id;
    const user_id = req.user._id;
    const commentData = {
      comment,
      user: mongoose.Types.ObjectId(user_id),
      event: mongoose.Types.ObjectId(event_id),
    };

    await commentHanlder.insertData(commentData);

    res.status(200).json({
      status: 200,
      message: "comment added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "error adding comment",
      error,
    });
  }
}

/////////////////
//get all comments on event
/////////////////
async function getAllComments(req, res) {
  try {
    const event_id = req.params.event_id;
    const comments = await commentHanlder.findSortedData(
      { event: mongoose.Types.ObjectId(event_id) },
      "createdAt",
      -1
    );
    res.status(200).json({
      message: "comments fetched successfully",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error getting comments",
      error,
    });
  }
}

/////////////////
//delete comment on event by comment owner or event owner
/////////////////
async function deleteComment(req, res) {
  try {
    const comment_id = req.query.comment_id;
    const event_id = req.query.event_id;
    //find event owner by event id
    const eventdata = await eventHanlder.findDataById(event_id);
    //console.log(eventdata.user_id.toString());
    const event_owner = eventdata.user_id.toString();
    //console.log(event_owner);
    const user_id = req.user._id.toString();
    console.log(user_id);
    const comment = await commentHanlder.findDataById(comment_id);
    console.log(comment);
    if (comment.user.toString() === user_id || event_owner === user_id) {
      console.log("comment deleted.");
      await commentHanlder.deleteDataById(comment_id);
      await replyHandler.deleteData({
        comment: mongoose.Types.ObjectId(comment_id),
      });
      res.status(200).json({
        message: "comment deleted successfully",
      });
    } else {
      res.status(401).json({
        message: "unauthorized",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error deleting comment",
      error,
    });
  }
}

module.exports = {
  postComment,
  getAllComments,
  deleteComment,
};
