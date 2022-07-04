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
    return await this.model.findByIdAndUpdate(id, data);
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
}
module.exports = QueryHandler;
