const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
  }
  async getAreaAction() {
    const data = await this.module('common_area').select();

    return this.success(data);
  }
};
