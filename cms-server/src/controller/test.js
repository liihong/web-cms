const Base = require('./base.js');

module.exports = class extends Base {
  async getTestListAction() {
    const data = await this.model('cwz_test').select();

    return this.success(data);
  }
};
