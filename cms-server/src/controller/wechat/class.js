const Base = require('../base.js');
const util = require('../../../utils/util.js');

module.exports = class extends Base {
  async indexAction() {}

  
  // 添加
  async addClassAction() {
    const form = this.post();

    form.id = util.getUUId();
    const data = await this.model('wechat_class').add(form);

    return this.success(data);
  }

  // bianji
  async editClassAction() {
    const form = this.post();

    const data = await this.model('wechat_class').update(form);

    return this.success(data);
  }

  async getOrgListAction() {
    const orgList = await this.model('wechat_orgs').field('id,org_name').select();
    return this.success(orgList);
  }

  async getClassInfoByIdAction() {
    const classId = this.get('id');
    const data = await this.model('wechat_class').where({id: classId}).find();
    return this.success(data);
  }

  // 根据机构ID返回该机构下的所有课程信息
  async getClassListByOrgIdAction() {
    try {
      const currentPage = this.get('currentPage');
      const pageSize = this.get('pageSize');
      const orgId = this.get('orgId');
      const typeId = this.get('type');

      const whereObj = {
        class_status: 1
      };
      // 0 默认全部
      if (orgId && orgId !== '0') {
        whereObj.class_org_id = orgId;
      }
      // 0 默认全部
      if (typeId && typeId !== '0') {
        whereObj.class_type = typeId;
      }
      const orgList = await this.model('wechat_class').where(whereObj).page(currentPage, pageSize).countSelect();
      return this.success(orgList);
    } catch (ex) {
      return this.fail();
    }
  }

  // 根据机构ID返回该机构下的所有课程信息
  async getClassListByTypeIdAction() {
    try {
      const typeId = this.get('typeId');

      const whereObj = {
        class_status: 1
      };
      // 0 默认全部
      if (typeId && typeId !== '0') {
        whereObj.class_type = typeId;
      }
      const orgList = await this.model('wechat_class').where(whereObj).select();
      return this.success(orgList);
    } catch (ex) {
      return this.fail();
    }
  }

  // 根据机构ID返回该机构下的所有课程分类信息
  async getClassTypeListByOrgIdAction() {
    const orgId = this.get('orgId');
    const data = await this.model('wechat_class_type').where({
      type_org_id: orgId
    }).field('id,type_name').select();
    return this.success(data);
  }

  // 根据课程ID获取课程详情
  async getClassDetailByIdAction() {
    const classId = this.get('id') || '';
    const token = this.get('userId') || '';

    // try {
    const isCollect = await this.model('wechat_user_collect').where({
      class_id: classId,
      user_id: token
    }).select();

    const data = await this.model('wechat_class').where({
      id: classId
    }).find();
    data.isCollection = isCollect.length > 0 ? 1 : 0;

    const classList = await this.model('wechat_class').where({
      'class_type': data.class_type
    }).field('id,class_name,class_img,class_playNum,class_video,class_desc').select();
    data.classList = classList;
    return this.success(data);
    // } catch (ex) {
    //   return this.fail(ex);
    // }
  }

  // 获取用户收藏课程列表
  async getUserCollectAction() {
    const token = this.get('userId');

    const data = await this.model('wechat_class').join(`wechat_user_collect on wechat_class.id=wechat_user_collect.class_id where wechat_user_collect.user_id ='${token}'`).select();

    return this.success(data);
  }

  // 点击播放播放量+1
  async addClassPlayNumAction() {
    const classId = this.post('id');

    const data = await this.model('wechat_class').where({
      id: classId
    }).increment('class_playNum', 1);

    return this.success(data);
  }

  // 设置收藏
  async setClassCollectAction() {
    const {
      classId,
      userId,
      status
    } = this.post();

    const data = {
      id: util.getUUId(),
      class_id: classId,
      user_id: userId
    };
    if (userId === '') {
      return this.fail(500, '用户ID为空');
    }
    try {
      // 0 取消收藏  1 收藏
      if (Number(status) === 0) {
        const result = await this.model('wechat_user_collect').where({
          class_id: classId,
          user_id: userId
        }).delete();
        return this.success(result);
      } else {
        const result = await this.model('wechat_user_collect').add(data);
        return this.success(result);
      }
    } catch (ex) {
      return this.fail(ex);
    }
  }
};