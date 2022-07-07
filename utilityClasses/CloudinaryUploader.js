const cloudinary = require("cloudinary");
class CloudinaryUploader {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
  async uploadImage(file, folder) {
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
  async deleteImages(urls) {
    urls.map((url) => {
      cloudinary.uploader.destroy(url.public_id);
    });
    return true;
  }
}
module.exports = CloudinaryUploader;
