const mongoose = require("mongoose");
class QueryHandler {
  constructor(model) {
    this.model = model;
  }
  async findData(query) {
    return await this.model.find(query);
  }
  async findSortedData(query, sortBy, sortOrder) {
    return await this.model.find(query).sort({ [sortBy]: sortOrder });
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
  async getDataOnTheBasisOfUpcomingDate(date) {
    return await this.model.find({
      event_date: {
        $gte: date,
      },
    });
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
