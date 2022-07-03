const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
dotenv.config();
class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  //upload method
  static async uploads(file, folder) {
    return new Promise((resolve) => {
      cloudinary.uploader.upload(
        file,
        (result) => {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        },
        {
          resource_type: "auto",
          folder: folder,
        }
      );
    });
  }
  //destroy method
  static async destroy(public_id) {
    return new Promise((resolve) => {
      cloudinary.uploader.destroy(public_id, (result) => {
        resolve({
          result: result,
        });
      });
    });
  }
}

module.exports = Cloudinary;
