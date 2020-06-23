const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }
  /**
   * 获取首页所需数据
   */
  async getHomeDataAction(){
      
    //banner数据
    const bannerList = await this.model('wechat_images').where({
        type:'BANNER'
    }).select()

    //栏目数据
    const orgTypeList = await this.model('resource_type').where({
        status:1
    }).select()

    //热门课程列表数据
    const classList = await this.model('wechat_class').where({
        ishot:1
    }).select()

    //首页热门机构数据
    const orgList = await this.model('wechat_orgs').where({
        ishot:1
    }).select()

    return this.success({
      bannerList,
      orgTypeList,
      classList,
      orgList
    })
  }
};
