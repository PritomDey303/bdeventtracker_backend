const mongoose = require("mongoose");
class QueryHandler {
  constructor(model) {
    this.model = model;
  }
  async findData(query) {
    return await this.model.find(query);
  }
  async findSortedByDateAndPaginatedData(query, page) {
    return await this.model
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * 10)
      .limit(10);
  }
  async findDataById(id) {
    let objId = mongoose.Types.ObjectId(id);
    return await this.model.findById(objId);
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
    let Id = mongoose.Types.ObjectId(id);
    return await this.model.findByIdAndUpdate(Id, data);
  }
  async updateDataByEmail(email, data) {
    return await this.model.findOneAndUpdate({ email: email }, data);
  }
  //update many data
  async updateManyData(query, data) {
    return await this.model.updateMany(query, data);
  }

  async deleteData(query) {
    return await this.model.deleteMany(query);
  }
  async deleteDataById(id) {
    let Id = mongoose.Types.ObjectId(id);
    return await this.model.findByIdAndDelete(Id);
  }
  async deleteAllData() {
    return await this.model.deleteMany({});
  }
  //get filtered events
  async getFilteredEventData(
    eventName,
    eventType,
    startdate,
    enddate,
    lat,
    lng,
    distance,
    limit
  ) {
    return await this.model
      .find({
        event_name: { $regex: eventName, $options: "i" },
        event_type: { $regex: eventType, $options: "i" },
        event_date: { $gte: startdate, $lte: enddate },
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat],
            },
            $maxDistance: distance,
          },
        },
      })
      .limit(limit);
  }
}

module.exports = QueryHandler;
