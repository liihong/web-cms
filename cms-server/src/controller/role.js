import util from '../../utils/util';
const Base = require('./base.js');

const modelName = 'cms_role';

module.exports = class extends Base {
  // 根据id获取新闻详情
  async getDetailByIdAction() {
    const data = await this.model(modelName).where({id: this.get('id')}).find();
    return this.success(data);
  }

  async getTreeListAction() {
    const data = await this.model('cms_resource').select();

    return this.success(data);
  }
  async getResByRoleIdAction() {
    const id = this.get('id');
    const data = await this.model('cms_role_resource').field('resId').where({roleId: id}).select();

    return this.success(data);
  }

  async saveRoleResAction() {
    const roleId = this.post('roleId');
    const res = this.post('res');
    const arr = [];
    res.map(item => {
      arr.push({
        id: util.getUUId(),
        resId: item,
        roleId: roleId
      });
    });

    const deleteData = await this.model('cms_role_resource').where({roleId: roleId}).delete();

    const addRes = await this.model('cms_role_resource').addMany(arr);

    return this.success(addRes);
  }
};
