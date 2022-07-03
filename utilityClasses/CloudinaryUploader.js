const cloudinary = require("cloudinary");

class CloudinaryUploader {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  static async uploadImage(image, folder) {
    let result = await cloudinary.uploader.upload(image, {
      folder: folder,
    });
    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  }

  static async deleteImage(public_id) {
    return cloudinary.uploader.destroy(public_id);
  }
}

module.exports = CloudinaryUploader;
