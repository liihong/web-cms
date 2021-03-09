const Base = require('../base.js');
const util = require('../../../utils/util');
const fs = require('fs');
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

  async addOrgAction() {
    const form = this.post();

    form.id = util.getUUId();
    const data = await this.model('wechat_orgs').add(form);

    return this.success(data);
  }
  // 编辑
  async editOrgAction() {
    const form = this.post();

    const data = await this.model('wechat_orgs').update(form);

    return this.success(data);
  }

  // 上传图片
  async uploadImageAction() {
    const orgId = this.post('orgId');
    if (!think.isEmpty(this.file('file'))) {
      // 进行压缩等处理
      const file = think.extend({}, this.file('file'));

      // 保存文件的路径
      const savepath = think.ROOT_PATH + '/../upload/images/' + orgId + '/';
      think.mkdir(savepath); // 创建该目录
      const filepath = file.path; // 文件路径
      const filename = file.name; // 文件名
      const suffix = filename.substr(filename.lastIndexOf('.') + 1); // 文件后缀
      // 读文件
      const datas = fs.readFileSync(filepath);
      // 写文件
      fs.writeFileSync(savepath + filename, datas);
      const newpath = savepath + filename;
      file.path = newpath;

      const tzData = {
        id: util.getUUId(),
        img_org_id: orgId,
        img_type: suffix,
        img_name: filename,
        img_path: file.path,
        img_url: 'http://letonglexue.com/upload/images/' + orgId + '/' + filename
      };
      const data = await this.model('wechat_images').add(tzData);
      return this.success(data);
    }
  }

  // 删除机构图片
  async deleteImageAction() {
    const imgId = this.post('id');

    const data = await this.model('wechat_images').where({id: imgId}).delete();

    return this.success(data);
  }

  async getImgListAction() {
    const orgId = this.get('id');

    const data = await this.model('wechat_images').field('id,img_path url,img_url open_path').where({img_org_id: orgId}).select();

    return this.success(data);
  }
};
