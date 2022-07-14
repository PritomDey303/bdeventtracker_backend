const mongoose = require("mongoose");
const attendee = require("../models/attendeeSchema");
const QueryHandler = require("../utilityClasses/QueryHandler");
const attendeeObj = new QueryHandler(attendee);

async function addAttendee(req, res) {
  try {
    const event_id = mongoose.Types.ObjectId(req.params.event_id);
    const user_id = mongoose.Types.ObjectId(req.user._id);
    const attendee = await attendeeObj.insertData({ event_id, user_id });
    res.status(200).json({
      status: 200,
      message: "Attendee added successfully.",
      data: attendee,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
//delete attendee by user_id and event_id
async function deleteAttendee(req, res) {
  try {
    const event_id = mongoose.Types.ObjectId(req.params.event_id);
    const user_id = mongoose.Types.ObjectId(req.user._id);
    const attendee = await attendeeObj.deleteData({ event_id, user_id });
    res.status(200).json({
      status: 200,
      message: "Attendee deleted successfully.",
      data: attendee,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
//get all attendees by event_id
async function getAttendees(req, res) {
  try {
    const event_id = mongoose.Types.ObjectId(req.params.event_id);
    const attendees = await attendeeObj.findData({ event_id });
    res.status(200).json({
      status: 200,
      message: "Attendees fetched successfully.",
      data: attendees,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}
//get all attendees by user_id
async function getAttendeesByUser(req, res) {
  try {
    const user_id = mongoose.Types.ObjectId(req.user._id);
    const attendees = await attendeeObj.findData({ user_id });
    res.status(200).json({
      status: 200,
      message: "Attendees fetched successfully.",
      data: attendees,
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
}

module.exports = {
  addAttendee,
  deleteAttendee,
  getAttendees,
  getAttendeesByUser,
};
