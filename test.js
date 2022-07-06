//multer multipart/form-data handle in oop way
class Test {
  constructor(folder) {
    this.folderName = folder;
  }

  uploadImage(req, res, next) {
    console.log(this.folderName);
  }
}
const test = new Test("event-images");
test.uploadImage();
