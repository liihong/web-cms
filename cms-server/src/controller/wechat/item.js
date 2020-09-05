const Base = require('../base.js');
const util = require('../../../utils/util');

module.exports = class extends Base {
  async indexAction() {
  }

  // 根据ID获取项目详情
  async getItemDetailByIdAction() {
    const itemId = this.get('id');
    const data = await this.model('wechat_items').where({id: itemId}).find();
    return this.success(data);
  }

  // 获取项目列表
  async getItemTopListAction() {
    try {
      const currentPage = this.get('currentPage');
      const pageSize = this.get('pageSize');
      const type = this.get('type');
      const whereObj = {item_status: 1, item_istop: 1};
      // 0 默认全部
      if (type !== '0') {
        whereObj.org_type = type;
      }
      const orgList = await this.model('wechat_items').where(whereObj).page(currentPage, pageSize).countSelect();
      return this.success(orgList);
    } catch (ex) {
      return this.fail();
    }
  }

  // 获取项目列表
  async getItemListAction() {
    try {
      const currentPage = this.get('currentPage');
      const pageSize = this.get('pageSize');
      const type = this.get('type');
      const whereObj = {item_status: 1};
      // 0 默认全部
      if (type !== '0') {
        whereObj.org_type = type;
      }
      const orgList = await this.model('wechat_items').where(whereObj).page(currentPage, pageSize).countSelect();
      return this.success(orgList);
    } catch (ex) {
      return this.fail();
    }
  }

  // 获取项目分类
  async getItemTypeListAction() {
    const data = await this.model('system_dictionaries').field('value id,name').where({type: 'item_type'}).select();
    return this.success(data);
  }

  // 新增项目
  async addItemAction() {
    const form = this.post();

    form.id = util.getUUId();
    const data = await this.model('wechat_items').add(form);

    return this.success(data);
  }
};
