module.exports = class extends think.Model {
  async getTableInfo(tableId) {
    const table = await this.field(['table_id,table_name,resource_name,where_sql,orderby_sql,is_view,is_delete,is_edit,is_add,is_export,is_import']).where({
      table_id: ['=', tableId]
    }).find();
    return table;
  }
};
