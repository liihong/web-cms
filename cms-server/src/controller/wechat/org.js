const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
  }

  async getOrgInfoByIdAction() {
    const orgId = this.get('id');
    const imgList = await this.model('wechat_images').where({img_org_id: orgId}).field('id img_id,img_name,img_path,img_url').select();
    const data = await this.model('wechat_orgs').where({id: orgId}).find();
    data.org_imgs = imgList;
    return this.success(data);
  }

  async getOrgListAction() {
    try {
      const currentPage = this.get('currentPage');
      const pageSize = this.get('pageSize');
      const type = this.get('type');
      const whereObj = {org_status: 1};
      // 0 默认全部
      if (type !== '0') {
        whereObj.org_type = type;
      }
      const orgList = await this.model('wechat_orgs').where(whereObj).page(currentPage, pageSize).countSelect();
      return this.success(orgList);
    } catch (ex) {
      return this.fail();
    }
  }

  async getOrgTypeListAction() {
    const data = await this.model('resource_type').field('id,type_name').select();
    return this.success(data);
  }
};
