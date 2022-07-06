const fs = require("fs");
const CloudinaryUploader = require("../utilityClasses/CloudinaryUploader");
const MulterUploader = require("../utilityFunctions/multerUploader");
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
      res.send(urls);
    } else {
      res.json({
        status: 405,
        message: "Images not uploaded successfully.",
      });
    }
  } catch (err) {
    console.log(err);
  }
}
//////////////////////////
//event create
//////////////////////////
async function eventCreate(req, res, next) {
  console.log("eventCreate");
  try {
    const event = await Event.create({
      ...req.body,
      eventBannerImage: req.eventBannerImage,
    });
    res.json({
      status: 200,
      message: "Event created successfully.",
      data: event,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  eventImageMulterUpload,
  eventImageCloudinaryUpload,
  eventCreate,
};
