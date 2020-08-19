module.exports = class extends think.Model {
  async getTableData(tableId, flag, whereObj) {
    const table = await this.model('resource_table').getTableInfo(tableId);
    const displayColumn = await this.model('resource_table_column').getColumnList(tableId, flag);
    const displayColumnArr = [];
    displayColumn.map(item => {
      switch (item.property_type) {
        case '1': // 文本框形式不需要翻译
        case '3': // 日期
        case '5': // 日期时间
          displayColumnArr.push(item.column_name);
          break;
        case '2': // 有外键关系,需要翻译
          displayColumnArr.push(`(SELECT NAME FROM (${item.type_sql}) tras WHERE tras.id=${item.column_name}) ${item.column_name}`);
          break;
        case '4': // 字段数据
          displayColumnArr.push(`(SELECT NAME FROM (${item.type_sql}) tras WHERE tras.id=${item.column_name}) ${item.column_name}`);
          break;
        case '7': // 自动填充
          displayColumnArr.push(`${item.type_sql} ${item.column_name}`);
          break;
        case '13': // 附件的话，外链表，单独查询
          break;
        default:
          displayColumnArr.push(item.column_name);
          break;
      }
    });
    const data = await this.model(table.table_name)
      .field(displayColumnArr.join(',')).where(table.where_sql).where(whereObj).alias('t').select();

    return data;
  }
  // 执行传入的sql文件
  async executeSql(sql) {
    return this.model().execute(sql).select();
  }

  // 获取查询对象
  async getWhereObj(query, queryColumn, queryKey, tableId) {
    const _this = this;
    const displayColumn = await this.model('resource_table_column').getColumnList(tableId);
    const queryColumns = [];
    const whereObj = {};
    const pArr = [];
    if (query && query !== '{}' && JSON.stringify(query) !== '{}') {
      const key = Object.keys(query)[0];
      whereObj[key] = ['=', `${query[key]}`];
    }
    await displayColumn.map(async(item) => {
      if (item.is_query === '1') {
        switch (item.property_type) {
          case '1': // 文本框形式不需要翻译
          case '3': // 日期
          case '5': // 日期时间
            queryColumns.push({
              key: item.column_name,
              value: queryKey,
              type: false
            });
            break;
          case '2': // 有外键关系,需要翻译
            pArr.push(_this.getData(queryColumns, item, queryKey));
            break;
          case '4': // 字段数据
          case '13': // 附件
            break;
          default:
            queryColumns.push({
              key: item.column_name,
              value: queryKey,
              type: false
            });
            break;
        }
      }
    });
    if (pArr.length > 0) {
      await Promise.all(pArr).then(async() => {
        const complex = {
          _logic: 'or'
        };
        queryColumns.map(item => {
          if (item.type) {
            complex[`${item.key}`] = ['in', `${item.value}`];
          } else {
            complex[`${item.key}`] = ['like', `%${item.value}%`];
          }
        });
        if (queryColumns.length > 0) {
          whereObj._complex = complex;
        }
      });
    }
    if (queryColumns.length > 0) {
      const complex = {
        _logic: 'or'
      };
      queryColumns.map(item => {
        if (item.type) {
          complex[`${item.key}`] = ['in', `${item.value}`];
        } else {
          complex[`${item.key}`] = ['like', `%${item.value}%`];
        }
      });
      whereObj._complex = complex;
    } else {
      if (queryColumn != '' && queryColumn) {
        whereObj[`CONCAT(${queryColumn})`] = ['like', `%${queryKey}%`];
      }
    }
    return whereObj;
  }

  executePromise(arr) {

  }
  getData(queryColumns, item, queryKey) {
    return new Promise(async resolve => {
      const wjData = await this.query(`(SELECT id FROM (${item.type_sql}) tras WHERE tras.name like '%${queryKey}%')`);
      if (wjData.length > 0) {
        const value = [];
        wjData.map(item => {
          value.push(item.id);
        });
        queryColumns.push({
          type: true,
          key: item.column_name,
          value: value.join(',')
        });
      }
      resolve();
    });
  }
};
