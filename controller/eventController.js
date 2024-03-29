const fs = require("fs");
const Event = require("../models/eventSchema");
const CloudinaryUploader = require("../utilityClasses/CloudinaryUploader");
const QueryHandler = require("../utilityClasses/QueryHandler");
const MulterUploader = require("../utilityFunctions/multerUploader");
const Comment = require("../models/commentSchema");
const Reply = require("../models/replySchema");
const NotificationHandler = require("../utilityClasses/NotificationHandler");
const mongoose = require("mongoose");
///////////////////
//comment object
///////////////////
const commentHandler = new QueryHandler(Comment);
const replyHandler = new QueryHandler(Reply);
/////////////
//event object
/////////////
///////////////
//cloudinary object
//////////////////////////////
const EventObj = new QueryHandler(Event);
///////////////////////
//event image multer upload
///////////////////////

async function eventImageMulterUpload(req, res, next) {
  try {
    const upload = await MulterUploader.uploader(
      "event_banner_images",
      ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      1000000,
      "Only .jpg, jpeg, .gif or .png format allowed!"
    );

    upload.any()(req, res, (err) => {
      if (err) {
        console.log(err);
        res.json({
          status: 500,
          message: err.message,
        });
      } else {
        next();
      }
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in event image upload",
    });
  }
}
//////////////////////
//event image cloudinary uploader
//////////////////////
async function eventImageCloudinaryUpload(req, res, next) {
  console.log("event image cloudinary upload");
  try {
    const uploader = new CloudinaryUploader();
    if (req.method === "POST") {
      const urls = [];

      for (let file of req.files) {
        const { path } = file;
        const newPath = await uploader.uploadImage(
          path,
          "bdeventtracker/event-images"
        );
        console.log(newPath);
        urls.push(newPath);
        fs.unlinkSync(path);
      }
      console.log(urls);
      req.eventBannerImage = urls;
      next();
    } else {
      res.json({
        status: 405,
        message: "Images not uploaded successfully.",
      });
    }
  } catch (err) {
    console.log("error");
    for (let file of req.files) {
      const { path } = file;
      fs.unlinkSync(path);
    }
    res.json({
      status: 500,
      message: err.message,
    });
  }
}
//////////////////////////
//event create
//////////////////////////
async function eventCreate(req, res, next) {
  console.log("event create");
  const uploader = new CloudinaryUploader();

  try {
    const locationData = JSON.parse(req.body.event_location);
    let lat = locationData[0].lat;
    let lng = locationData[0].lng;
    //convert lat long to number
    lat = Number(lat);
    lng = Number(lng);
    console.log(locationData);
    const eventData = await EventObj.insertData({
      ...req.body,
      location: {
        type: "Point",
        coordinates: [lng, lat],
      },

      user_id: mongoose.Types.ObjectId(req.user._id),
      event_banner_image: req.eventBannerImage,
    });
    body = "Event created successfully.";
    await NotificationHandler.saveNotification(
      body,
      eventData.user_id,
      eventData.user_id,
      eventData._id
    );
    res.json({
      status: 200,
      message: "Event created successfully.",
      data: eventData,
    });
  } catch (err) {
    console.log(err.message);
    const info = await uploader.deleteImages(req.eventBannerImage);
    res.json({
      status: 500,
      message: "Error in creating event",
    });
  }
}

//////////////////////////
//update event
//////////////////////////
async function updateEvent(req, res, next) {
  const uploader = new CloudinaryUploader();

  try {
    const eventUpdatedData = await EventObj.findDataById(req.params.id);
    let event_banner_image = [];
    if (req.eventBannerImage.length > 0) {
      event_banner_image = req.eventBannerImage;
    } else {
      event_banner_image = eventUpdatedData.event_banner_image;
    }
    const eventData = await EventObj.updateData(req.params.id, {
      ...req.body,
      user_id: mongoose.Types.ObjectId(req.user._id),
      event_banner_image: event_banner_image,
    });
    res.json({
      status: 200,
      message: "Event updated successfully.",
      data: eventData,
    });
  } catch (err) {
    const info = await uploader.deleteImages(req.eventBannerImage);
    res.json({
      status: 500,
      message: "Error in updating event",
    });
  }
}

//////////////////////////
//get all events
//////////////////////////
async function getAllEvents(req, res, next) {
  try {
    const events = await EventObj.findData({
      event_date: { $gte: new Date().toLocaleDateString("en-GB") },
    });
    res.json({
      status: 200,
      message: "All events fetched successfully.",
      data: events,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in fetching all events",
    });
  }
}

//////////////////////////
//get event by id
//////////////////////////
async function getEventById(req, res, next) {
  try {
    const event = await EventObj.findDataById(req.params.id);
    res.json({
      status: 200,
      message: "Event fetched successfully.",
      data: event,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in fetching event",
    });
  }
}
//////////////////////////
//get events by user id
//////////////////////////
async function getEventsByUserId(req, res, next) {
  //console.log(req.params);
  try {
    //find sorted by date events by user id\
    const events = await EventObj.findData({
      user_id: mongoose.Types.ObjectId(req.params.id),
    });

    res.json({
      status: 200,
      message: "Events fetched successfully.",
      data: events,
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: "Error in fetching events",
    });
  }
}

////////////////////////////////////////////

//get filtered event
////////////////////////////////////////////
async function getFilteredEventData(req, res, next) {
  try {
    console.log(req.query);
    const eventName = req.query.event_name;
    const eventCategory = req.query.event_category;
    const eventType = req.query.event_type;
    const events = await EventObj.findData({
      event_name: { $regex: eventName, $options: "i" },
      event_category: { $regex: eventCategory, $options: "i" },
      event_type: { $regex: eventType, $options: "i" },
      event_date: { $gte: new Date().toLocaleDateString("en-GB") },
    });
    res.json({
      status: 200,
      message: "Events fetched successfully.",
      data: events,
    });
  } catch (err) {
    res.json({
      status: 500,
      message: "Error in fetching events",
    });
  }
}
//get location filtered event
async function getEventsByLatLong(req, res, next) {
  try {
    const lat = Number(req.query.latitude);
    const long = Number(req.query.longitude);
    const radius = Number(req.query.radius);
    //console.log(lat, long, radius);
    const events = await EventObj.findData({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [long, lat],
          },
          $maxDistance: radius,
        },
      },
      event_date: { $gte: new Date().toLocaleDateString("en-GB") },
    });
    res.json({
      status: 200,
      message: "Events fetched successfully.",
      data: events,
    });
  } catch (err) {
    // console.log(err.message);
    res.json({
      status: 500,
      message: "Error in fetching events",
    });
  }
}
//////////////////////////
//delete event
///////////////////////////
async function deleteEvent(req, res, next) {
  try {
    const uploader = new CloudinaryUploader();
    const event = await EventObj.findDataById(req.params.event_id);
    //console.log(event);
    const images = event.event_banner_image;
    const info1 = await EventObj.deleteDataById(req.params.event_id);
    const info2 = await await uploader.deleteImages(images);
    console.log(info1, info2);
    // await commentHandler.deleteData({
    //   event: mongoose.Types.ObjectId(req.params.id),
    // });
    res.json({
      status: 200,
      message: "Event deleted successfully.",
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: 500,
      message: "Error in deleting event",
    });
  }
}
module.exports = {
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate,
  getAllEvents,
  getEventById,
  getEventsByUserId,
  updateEvent,
  getFilteredEventData,
  deleteEvent,
  getEventsByLatLong,
};
