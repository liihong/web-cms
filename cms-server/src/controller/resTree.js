const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction() {
    const model = this.model('resource_table');
    const data = await model
      .field(['table_id id,table_name,resource_name title,false leaf,\'\' children'])
      .where({table_id: ['like', '__']}).select();
    return this.success(data);
  }

  async getResTreeListAction() {
    const model = this.model('resource_table');
    const data = await model
      .field(['table_id id,table_name,resource_name title,LEFT(table_id,length(table_id)-2) pid'])
      .order('id').select();
    return this.success(data);
  }

  async getResTreeChildrenAction() {
    const tableId = this.get('id');
    const model = this.model('resource_table');
    const data = await model
      .field(['table_id id,table_name,resource_name title,true leaf,\'\' children'])
      .where({table_id: ['like', `${tableId}__`]}).select();
    return this.success(data);
  }
};
