const fs = require("fs");
const Event = require("../models/eventSchema");
const CloudinaryUploader = require("../utilityClasses/CloudinaryUploader");
const QueryHandler = require("../utilityClasses/QueryHandler");
const MulterUploader = require("../utilityFunctions/multerUploader");
const Comment = require("../models/commentSchema");

///////////////////
//comment object
///////////////////
const commentHander = new QueryHandler(Comment);
/////////////
//event object
/////////////
const EventObj = new QueryHandler(Event);
///////////////////////
//event image multer upload
///////////////////////
async function eventImageMulterUpload(req, res, next) {
  try {
    const upload = await MulterUploader.uploader(
      "event-images",
      ["image/jpeg", "image/jpg", "image/png", "image/gif"],
      1000000,
      "Only .jpg, jpeg, .gif or .png format allowed!"
    );

    upload.any()(req, res, (err) => {
      if (err) {
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

        urls.push(newPath);
        fs.unlinkSync(path);
      }
      req.eventBannerImage = urls;
      console.log(req.eventBannerImage);
      next();
    } else {
      res.json({
        status: 405,
        message: "Images not uploaded successfully.",
      });
    }
  } catch (err) {
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
  try {
    const eventData = await EventObj.insertData({
      ...req.body,
      event_banner_image: req.eventBannerImage,
    });
    res.json({
      status: 200,
      message: "Event created successfully.",
      data: eventData,
    });
  } catch (err) {
    const info = await MulterUploader.deleteImages(req.eventBannerImage);
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
      event_banner_image: event_banner_image,
    });
    res.json({
      status: 200,
      message: "Event updated successfully.",
      data: eventData,
    });
  } catch (err) {
    const info = await MulterUploader.deleteImages(req.eventBannerImage);
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
    const events = await EventObj.findData({});
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
  try {
    const events = await EventObj.findSortedData(
      { user_id: req.params.id },
      event_date,
      desc
    );
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

////////////////////////////////////////////
//get filtered event
////////////////////////////////////////////
async function getFilteredEvents(req, res, next) {
  try {
    const {
      event_name,
      event_type,
      start_date,
      end_date,
      lat,
      lng,
      distance,
      limit,
    } = req.body;
    const events = await EventObj.getFilteredEventData(
      event_name,
      event_type,
      start_date,
      end_date,
      lat,
      lng,
      distance,
      limit
    );
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

//////////////////////////
//delete event
///////////////////////////
async function deleteEvent(req, res, next) {
  try {
    const event = await EventObj.findDataById(req.params.id);
    const images = event.event_banner_image;
    await EventObj.deleteDataById(req.params.id);
    await CloudinaryUploader.deleteImages(images);
    await commentHander.deleteData({
      event: mongoose.Types.ObjectId(req.params.id),
    });
    res.json({
      status: 200,
      message: "Event deleted successfully.",
    });
  } catch (err) {
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
  getFilteredEvents,
  deleteEvent,
};
