const mongoose = require("mongoose");
class QueryHandler {
  constructor(model) {
    this.model = model;
  }
  async findData(query) {
    return await this.model.find(query);
  }
  async findDataById(id) {
    return await this.model.findById(id);
  }
  async findDataByEmail(email) {
    return await this.model.findOne({ email });
  }

  async insertData(data) {
    return await this.model.create(data);
  }
  async insertManyData(data) {
    return await this.model.insertMany(data);
  }
  async updateData(id, data) {
    return await this.model.findByIdAndUpdate(id, data);
  }
  async updateDataById(id, data) {
    let userId = mongoose.Types.ObjectId(id);
    return await this.model.findByIdAndUpdate(userId, data);
  }
  async updateDataByEmail(email, data) {
    return await this.model.findOneAndUpdate({ email: email }, data);
  }
  async deleteData(id) {
    return await this.model.findByIdAndDelete(id);
  }
  async deleteAllData() {
    return await this.model.deleteMany({});
  }

  async getPaginationData(page, limit) {
    return await this.model
      .find()
      .skip(page * limit)
      .limit(limit);
  }
  async getSortedData(sortBy, sortOrder) {
    return await this.model.find().sort({ [sortBy]: sortOrder });
  }
  async getDataOnTheBaseOfNearby(lat, lng, distance) {
    return await this.model.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: distance,
        },
      },
    });
  }
}
module.exports = QueryHandler;
