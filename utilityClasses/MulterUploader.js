const multer = require("multer");
const path = require("path");
class MulterUploader {
  constructor(subfolder_path) {
    const upload_folder = `${__dirname}/../public/uploads/${subfolder_path}`;
    this.upload = multer({
      storage: multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, upload_folder);
        },
        filename: (req, file, cb) => {
          const fileExt = path.extname(file.originalname);
          const fileName =
            file.originalname
              .replace(fileExt, "")
              .toLowerCase()
              .split(" ")
              .join("-") +
            "-" +
            Date.now();

          cb(null, fileName + fileExt);
        },
      }),
      fileFilter: function (req, file, cb) {
        if (
          file.mimetype === "image/png" ||
          file.mimetype === "image/jpeg" ||
          file.mimetype === "image/gif" ||
          file.mimetype === "image/jpg"
        ) {
          cb(null, true);
        } else {
          cb(null, { status: 500, message: "Only images are allowed" });
        }
      },
    });
  }
  uploadImage(req, res, next) {
    this.upload.any()(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err);
        return res.status(500).json(err);
      } else if (err) {
        console.log(err);
        return res.status(500).json(err);
      }
      next();
    });
  }
}

module.exports = MulterUploader;
