const Base = require('../base.js');
const util = require('../../../utils/util');

module.exports = class extends Base {
  async getHomeDataAction() {
    const bannerList = await this.model('wechat_shop').where({shop_istop: 1}).field('id,shop_img img').select();

    const hotItemList = await this.model('wechat_items').where({item_istop: 1}).select();

    const shopList = await this.model('wechat_shop').where({shop_status: 1}).select();
    const data = {
      bannerList,
      shopList,
      hotItemList
    };

    return this.success(data);
  }

  // 根据ID获取项目详情
  async getShopDetailByIdAction() {
    const shopId = this.get('id');
    const data = await this.model('wechat_shop').where({id: shopId}).find();
    const itemList = await this.model('wechat_items').where({item_shop: shopId}).select();
    data.itemList = itemList;
    return this.success(data);
  }

  // 获取项目列表
  async getShopListAction() {
    try {
      const currentPage = this.get('currentPage');
      const pageSize = this.get('pageSize');
      const type = this.get('type');
      const whereObj = {item_status: 1};
      // 0 默认全部
      if (type !== '0') {
        whereObj.org_type = type;
      }
      const orgList = await this.model('wechat_shop').where(whereObj).page(currentPage, pageSize).countSelect();
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
  async addShopAction() {
    const form = this.post();

    form.id = util.getUUId();
    const data = await this.model('wechat_shop').add(form);

    return this.success(data);
  }

  async editShopAction() {
    const form = this.post();

    const data = await this.model('wechat_shop').where({id: form.id}).update(form);

    return this.success(data);
  }
};
