const Base = require('./base.js');

const modelName = 'news_centers';

module.exports = class extends Base {
  // 获取资源列表
  async indexAction() {
    const pageSize = this.get('pageSize');
    const pageNumber = this.get('pageNumber');
    const queryColumn = this.get('queryColumn');
    const queryKey = this.get('queryKey');
    const whereObj = {};
    if (queryColumn) {
      if (queryKey.includes(',')) {
        whereObj[`${queryColumn}`] = ['IN', `${queryKey}`];
      } else {
        whereObj[`${queryColumn}`] = ['like', `%${queryKey}%`];
      }
    }
    const data = await this.model(modelName).join({ table: 'system_dictionaries', join: 'left', on: ['type', 'id'] }).page(pageNumber, pageSize).where(whereObj).filed(
      'system_dictionaries.name as typeName'
    ).countSelect();
    return this.success(data);
  }
  // 根据id获取新闻详情
  async getNewsByIdAction() {
    const data = await this.model(modelName).where({id: this.get('id')}).find();
    return this.success(data);
  }
  // 新增资源
  async addAction() {
    const resource = this.post('form');
    const lastId = await this.model(modelName).max('id');
    resource.id = lastId + 1;
    try {
      const result = await this.model(modelName).add(resource);
      return this.success(result);
    } catch (ex) {
      return this.fail(ex);
    }
  }

  async updateAction() {
  }
};
