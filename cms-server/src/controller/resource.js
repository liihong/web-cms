const Base = require('./base.js');

const modelName = 'cms_resource';
module.exports = class extends Base {
  // 获取资源列表
  async indexAction() {
    const data = await this.model(modelName).select();
    return this.success(data);
  }
  // 新增资源
  async addAction() {
    const form = this.post('form');
    const lastId = await this.model(modelName).where({'parentId': form.parentId}).max('resId');
    if (lastId == null) {
      form.resId = form.parentId + '01';
    } else {
      form.resId = parseInt(lastId) + 1;
      form.resId = '0' + form.resId;
    }
    try {
      const result = await this.model(modelName).add(form);
      return this.success(result);
    } catch (ex) {
      return this.fail(ex);
    }
  }

  async updateAction() {
    const form = this.post('form');
    const id = form.resId;

    try {
      const result = await this.model(modelName).where({'resId': id}).update(form);
      return this.success(result);
    } catch (ex) {
      return this.fail(ex);
    }
  }
  // 删除
  async deleteAction() {
    const resId = this.post('resId');
    try {
      const result = await this.model(modelName).where({'resId': ['like', resId] }).delete();
      return this.success(result);
    } catch (ex) {
      return this.fail(ex);
    }
  }

  async getResByRoleIdAction() {
    const id = this.get('id');
    const data = await this.model('cms_role_resource').field('resId').where({roleId: id}).select();

    return this.success(data);
  }
};
