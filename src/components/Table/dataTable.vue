<!--公用组件：数据表格
   /**
   * dataTable
   * @module components/dataTable
   * @desc 数据表格
   * @author lihong
   * @date 2017年12月05日17:22:43
   * @param {string} [columnDatas] - 列名数组对象
   * @param {Object} [tableData]  - 表数据
   * @param {Boolean} [noFootBold]  - 是否最后一行加粗，true不加粗
   * @param {Boolean} [noFormate]  - 是否格式化数字
   * @example
   *  <hbTable :title="title" :columns="columns" :tableData="tableData"></hbTable>
   */
-->
<template>
  <section>
    <!--工具条-->
    <el-col :span="24" class="toolbar">
      <slot name="toolbar">
        <el-form :inline="true" :model="filters">
          <el-form-item>模糊查询:</el-form-item>
          <el-form-item item-width="300px">
            <el-select v-model="selColumns" multiple filterable placeholder="请选择">
              <el-option v-for="item in columnDatas" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="queryParams.queryKey" placeholder="模糊查询"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button v-on:click="queryList" type="primary" size="small" icon="el-icon-search">查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleAdd" type="primary" size="small" icon="el-icon-circle-plus">新增</el-button>
          </el-form-item>
        </el-form>
      </slot>
    </el-col>

    <!--列表-->
    <el-table class="el-table" :data="tableData" v-loading="listLoading" stripe border :max-height="tableHeight" style="width: 100%;">
      <el-table-column fixed="left" type="selection" width="50" align="center">
      </el-table-column>
      <el-table-column fixed="left" type="index" width="50" align="center">
        <template slot-scope="scope">
          <span>{{scope.$index+(queryParams.pageNumber - 1) * queryParams.pageSize + 1}} </span>
        </template>
      </el-table-column>
      <el-table-column fixed="left" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column v-for="(row,index) in columnDatas" :key="index" :prop="row.id" :align="row.align" :fixed="(row.frozen == 1?'left':false)" :label="row.name" :min-width="(row.length != '')?row.length:150" sortable>
        <template slot-scope="scope">
          <slot v-if="row.slot" :row="scope.row" :index="scope.$index" :name="row.slot"></slot>
          <span v-else>{{scope.row[row.id]}}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--工具条分页-->
    <el-col :span="24" class="toolbar">
      <slot name="bottomBar">
        <el-pagination background style="float: right" @current-change="handleCurrentChange" :current-page="queryParams.pageNumber" :page-sizes="[30, 60, 100, 150]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableInfo.count">
        </el-pagination>
      </slot>
    </el-col>
  </section>
</template>

<script>
import Table from 'element-ui'
export default {
  name: 'dataTable',
  extends: Table,
  // props: ['columnDatas', 'tableDatas','queryParams'],
  props: {
    columnDatas: {
      type: [Array, Object],
    },
    tableDatas: {
      type: [Array, Object],
    },
    tableInfo: {
      type: [Array, Object],
      default: ()=>({
        count: 0,
        data: []
      })
    },
    queryParams: {
      type: Object,
      default: ()=>({
        queryKey: '',
        queryColumn: '',
        pageSize: 20,
        pageNumber: 1
      })
    }
  },
  data() {
    return {
      filters: {
        columns: '',
        name: ''
      },
      listLoading: false,
      sels: [], //列表选中列
      selColumns: [],
      tableHeight: 600
    }
  },
  computed: {
    tableData(){
      if(this.tableInfo) {
        return this.tableInfo.data
      } else {
        return this.tableDatas
      }
    }
  },
  methods: {
    queryList() {
      this.queryParams.queryColumn = this.selColumns.join('|')
      this.$emit('initData')
    },
    //新增按钮
    handleAdd() {
      this.$emit('handleAdd')
    },
    // 编辑按钮事件处理
    handleEdit(index) {
      this.$emit('handleEdit', index)
    },
    handleDelete(index) {
      this.$emit('handleDelete', index)
    },
    handleCurrentChange() {
      this.$emit('initData')
    }
  },
  mounted() {
    var offsetHeight = window.innerHeight
    this.tableHeight = offsetHeight - 220
  },
  watch: {}
}
</script>
<style lang="scss" >
.toolbar {
  padding: 10px;
  margin: 10px 0;
  background: #f2f2f2;
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>