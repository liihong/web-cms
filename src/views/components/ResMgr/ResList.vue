<!--通用资源管理组件
props:{

}
event:{
  saveAfter()
  deleteAfter()
}
-->
<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true" v-show="!noTool" @submit.native.prevent>
        <el-form-item v-show="!noAdd">
          <el-button size="mini" @click="handleAdd" type="primary" icon="el-icon-circle-plus">新增</el-button>
        </el-form-item>
        <el-form-item>
          <!-- <el-button size="mini" @click="handleExport" type="primary" icon="el-icon-download">导出</el-button> -->
        </el-form-item>
        <el-form-item>
          <el-input
            size="small"
            v-model="queryParams.queryKey"
            placeholder="模糊查询"
            @keyup.enter.native="queryResList"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" @click="queryResList" type="primary" icon="el-icon-search">查询</el-button>
          <el-button size="mini" @click="reset" type="primary" icon="el-icon-refresh">重置</el-button>
        </el-form-item>
        <div style="float:right;margin-right:30px;">
        <slot name="toolBar"></slot>
        </div>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      ref="elTable"
      :span-method="objectSpanMethod"
      highlight-current-row
      @sort-change="tableSort"
      @selection-change="selsChange"
      @row-click="rowClick"
      :data="resDatas"
      :row-class-name="tableRowClassName"
      v-loading="listLoading"
      header-cell-class-name="table_th"
      border
      height="70vh"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="25" align="center"></el-table-column>
      <el-table-column fixed="left" type="index" width="40" align="center" label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index+(queryParams.pageNumber - 1) * queryParams.pageSize + 1}}</span>
        </template>
      </el-table-column>
      <slot name="operate" />
      <el-table-column fixed="right" label="操作" width="150" align="center" v-if="!noEdit">
        <template slot-scope="scope">
          <el-button-group size="mini">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column
        :sortable="row.is_sort == '1' ? 'custom' : false"
        align="center"
        v-if="row.property_type != '10'"
        v-for="(row,index) in resRows"
        :key="index"
        :prop="row.column_name"
        :fixed="(row.is_frozen == 1?'left':false)"
        :label="row.column_cname"
        :min-width="(row.column_length != '')?row.column_length:150"
      >
        <!-- :filters="row.PROPERTY_TYPE =='2'?[]:selectObj[row.COLUMN_NAME] " -->
        <template slot-scope="scope">
          <span v-if="row.property_type == '2'">
            <slot :name="row.column_name" v-bind:row="scope.row">
              <!-- 后备内容 -->
              {{scope.row[`${row.column_name}_TEXT`]}}
            </slot>
          </span>
          <img width="50" v-else-if="row.property_type == '13'" :src="scope.row[row.column_name]" />
          <span v-else>
            <slot :name="row.column_name" v-bind:row="scope.row">
              <!-- 后备内容 -->
              {{scope.row[row.column_name]}}
            </slot>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条-->
    <el-col :span="24" class="pagination">
      <el-button
        type="danger"
        @click="batchRemove"
        :disabled="this.sels.length===0"
      >批量删除</el-button>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page="queryParams.pageNumber"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="sizeChange"
      ></el-pagination>
    </el-col>
    <resEdit @initData="getResList" @saveAfter="saveAfter" :dialogState="dialogState" />
  </section>
</template>

<script>
import resEdit from "./ResEdit";
import resMgrServices from '@/api/resMgr/index.js'
export default {
  name: "resList",
  props: {
    tableId: {
      type: String
    },
    noTool: {
      type: Boolean,
      default: false
    },
    noEdit: {
      type: Boolean,
      default: false
    },
    noAdd: {
      type: Boolean,
      default: false
    },
    query: {
      type: Object,
    },
    num: {
      type: Number
    }
  },
  components: {
    resEdit
  },
  data() {
    return {
      filters: {
        columns: "",
        name: "",
        value: ""
      },
      resRows: [],
      resDatas: [],
      total: 0,
      listLoading: false,
      sels: [], //列表选中列
      selectObj: {},
      tableHeight: 600,
      dialogState: {
        show: false,
        type: "add",
        formData: {},
        tableId: this.tableId,
        id: ""
      },
      queryParams: {
        tableId: this.tableId,
        order: "",
        pageNumber: 1,
        pageSize: 10,
        queryColumn: "",
        queryKey: ""
      }
    };
  },
  computed: {
    primaryKey() {
      let key = "";
      this.resRows.map(item => {
        if (item.property_type == "10") {
          key = item.column_name;
        }
      });
      return key;
    }
  },

  methods: {
    //获取过滤数据
    getSelectQuery() {
      this.resRows.map(item => {
        if (item.property_type == "2") {
          this.getSjzdData(item.column_name, item.typesql);
        }
      });
    },
    //获取表格配置信息
    getConfig() {
      resMgrServices.getTableColumns( {
          flag: "list",
          tableId: this.tableId
        })
        .then(res => {
          this.resRows = res.data;
          this.getSelectQuery();
          this.listLoading = false;
        });
    },
    queryResList() {
      if (this.query != undefined) {
        this.queryParams.query = this.query;
      }
      this.queryParams.pageNumber = 1;
      
      resMgrServices.getTableData(this.queryParams).then(res => {
        if (res.data) {
          this.resDatas = res.data.data;
          this.total = parseInt(res.data.count);
          this.listLoading = false;
          this.$nextTick(() => {
            this.$refs.elTable.doLayout();
          });
        }
      });
      this.$emit("getResList");
    },
    reset() {
      this.queryParams.queryKey = "";
      this.queryResList()
    },
    //获取表格数据
    getResList: function() {
      if (this.query != undefined) {
        this.queryParams.query = this.query;
      }
      resMgrServices.getTableData(this.queryParams).then(res => {
        if (res.data) {
          this.resDatas = res.data.data;
          this.total = parseInt(res.data.count);
          this.listLoading = false;
          this.$nextTick(() => {
            this.$refs.elTable.doLayout();
          });
        }
      });
      this.$emit("getResList");
    },
    //导出
    handleExport() {
      let params = {
        tableId: this.tableId
      };
      if (this.query != undefined) {
        params.query = this.query;
      }
     resMgrServices.exportExcel(params).then(res => {
        if (res.data) {
          let url = URL.createObjectURL(res.data);
          let fileName = res.headers["content-disposition"].split("=")[1];
          fileName = decodeURI(fileName);
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("id", "downloadLink");
          link.setAttribute("download", fileName);
          document.body.appendChild(link);
          link.click();
          // 删除添加的a链接
          let objLink = document.getElementById("downloadLink");
          document.body.removeChild(objLink);
        }
      });
    },
    //新增按钮
    handleAdd() {
      if (
        this.noEdit &&
        this.$parent.handleAdd &&
        this.$parent.handleAdd != undefined
      ) {
        this.$parent.handleAdd();
      } else {
        this.dialogState.type = "add";
        this.dialogState.formData = {};
        this.dialogState.show = !this.dialogState.show;
      }
    },
    // 点击保存后，如果还想执行什么操作可以在这个方法里进行
    saveAfter(info) {
      this.$emit("saveAfter", info);
    },
    // 编辑按钮事件处理
    handleEdit(row) {
      this.dialogState.formData = row;
      this.dialogState.id = row[this.primaryKey];
      this.dialogState.show = true;
      this.dialogState.type = "edit";
    },
    handleDelete(row, type = true) {
      if (type) {
        this.$message.confirmDelete(() => {
          let params = new FormData();
          params.append("tableId", this.tableId);
          params.append(this.primaryKey, row[this.primaryKey]);
          resMgrServices.deleteTableData(params).then(res => {
            if (res && res.data == 1) {
              this.$message.deleteSuccess();
              this.$emit("deleteAfter", row[this.primaryKey]);
              this.getResList();
            } else {
              this.$message.deleteError(res.data.errmsg);
            }
          });
        });
      } else {
        let params = new FormData();
        params.append("tableId", this.tableId);
        params.append(this.primaryKey, row[this.primaryKey]);
        this.$ajax.post(this.$api.deleteTableData, params).then(res => {
          if (res && res.data == 1) {
            this.$message.deleteSuccess();
            this.$emit("deleteAfter", row[this.primaryKey]);
            this.getResList();
          } else {
            this.$message.deleteError(res.data.errmsg);
          }
        });
      }
    },
    handleCurrentChange(val) {
      this.queryParams.pageNumber = val;
      this.getResList();
    },
    sizeChange(val) {
      this.queryParams.pageSize = val;
      this.getResList();
    },
    selsChange: function(sels) {
      this.sels = sels;
      this.$emit("selectChange", sels);
    },
    rowClick(row) {
      this.$refs.elTable.toggleRowSelection(row);
    },
    //批量删除
    batchRemove: function() {
      var ids = this.sels.map(item => {
        return item[this.primaryKey];
      });
      this.$confirm("确认删除选中记录吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          let params = {};
          params[this.primaryKey] = ids;
          params["tableId"] = this.tableId;
          resMgrServices.deleteTableData(params).then(res => {
            if (res && res.data && res.status == 0) {
              this.$message.success("批量删除成功");
              this.getResList();
            }else{
              this.$message.success("批量删除失败");
            }
          });
        })
        .catch(() => {});
    },
    // 获取数据字典数据
    getSjzdData(attr, sql) {
      resMgrServices.getDropDownListData({
          typesql: sql
        })
        .then(res => {
          let infos = res.data.map(item => {
            return { text: item.NAME, value: item.id };
          });
          this.$set(this.selectObj, attr, infos);
        });
    },
    // eslint-disable-next-line
    tableSort({ column, prop, order }) {
      if (order && order != null) {
        this.queryParams.order = prop + " " + order.replace("ending", "");
      } else {
        this.queryParams.order = "";
      }
      this.getResList();
    },
    objectSpanMethod({ row, column }) {
      const span = column["property"] + "-span";
      if (row[span]) {
        return row[span];
      }
    },
    mergeTableRow(data, merge) {
      if (!merge || merge.length === 0) {
        return data;
      }
      merge.forEach(m => {
        const mList = {};
        data = data.map((v, index) => {
          const rowVal = v[m];
          if (mList[rowVal]) {
            mList[rowVal]++;
            data[index - (mList[rowVal] - 1)][m + "-span"].rowspan++;
            v[m + "-span"] = {
              rowspan: 0,
              colspan: 0
            };
          } else {
            mList[rowVal] = 1;
            v[m + "-span"] = {
              rowspan: 1,
              colspan: 1
            };
          }
          return v;
        });
      });
      return data;
    },
    tableRowClassName({ row }) {
      if (row.SPZT && row.SPZT == 0) {
        return "warning-row";
      }
      return "";
    }
  },
  created() {
    this.getConfig();
    this.getResList();
  },
  activated() {
    this.getConfig();
    this.getResList();
  },
  beforeRouteLeave() {
    this.$destory();
  },
  watch: {
    num() {
      if (this.query != undefined) {
        this.queryParams.query = this.query;
      }
      this.getConfig();
      this.getResList();
    },
    dialogState: {
      deep: true,
      handler() {
        if (!this.dialogState.show) {
          this.getResList();
        }
      }
    },
    "query.SSHT"() {
      if (this.query != undefined) {
        this.queryParams.query = this.query;
      }
      this.getConfig();
      this.getResList();
    }
  }
};
</script>
<style>
.toolbar {
  /* text-align: right; */
  padding-top: 10px;
  padding-left: 10px;
}
.el-form-item {
  margin-bottom: 0px;
}
.pagination {
  padding: 10px;
  text-align: right;
  display: flex;
  justify-content: space-between;
}
.el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #f5f4f4;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>