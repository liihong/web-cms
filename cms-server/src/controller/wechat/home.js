const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  /**
   * 获取首页所需数据
   */
  async getHomeDataAction() {
    // const {lon, lat} = this.get();
    // banner数据
    const bannerList = await this.model('wechat_banner').where({
      banner_status: 1
    }).select();

    // 栏目数据
    const orgTypeList = await this.model('resource_type').where({
      type_status: 1
    }).select();

    // 热门课程列表数据
    const classList = await this.model('wechat_class').where({
      class_isHot: 1
    }).select();

    // 首页热门机构数据
    const orgList = await this.model('wechat_orgs').where({
      org_isHot: 1
    }).select();

    return this.success({
      bannerList,
      orgTypeList,
      classList,
      orgList
    });
  }

  async getIsShowVideoAction() {
    const data = await this.model('system_dictionaries').where({id: 1}).find();

    return this.success(data);
  }
};
