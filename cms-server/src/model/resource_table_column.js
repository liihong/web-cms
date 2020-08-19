module.exports = class extends think.Model {
  async getColumnList(tableId, flag) {
    const whereObj = {
      table_id: tableId
    };
    let order = '';
    if (flag) {
      const complex = {
        _logic: 'or'
      };
      complex[`is_${flag}`] = '1';
      whereObj._complex = complex;
      order = `${flag}_order asc`;
    }
    const data = await this.field()
      .where(whereObj).order(order).select();
    return data;
  }
  async getPrimaryKey(tableId) {
    const whereObj = {
      table_id: tableId,
      property_type: '10'
    };
    const data = await this.field(['column_name,column_cname,data_type,isunique,property_type,type_sql'])
      .where(whereObj).find();
    return data;
  }
  async getTypeSqlData(typesql) {
    const table = await this.query(typesql);
    return table;
  }
};
