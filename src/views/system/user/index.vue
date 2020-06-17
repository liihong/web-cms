<template>
  <div class="userManage">
    <el-row class="dr-datatable">
      <el-col :span="24">
        <dataTable priarmyKey="userId" :queryParams="queryParams" :columnDatas="columnDatas" :tableInfo="tableInfo" @initData="initData" @handleEdit="handleEdit" @handleDelete="handleDelete" @pageChange="pageChange" @handleAdd="handleAdd" @pageSizeChange="pageSizeChange">
          <el-form-item slot="toolbarAdd">
            <el-radio-group v-model="status" @change="changeRadio">
              <el-radio :label="1">已激活账户</el-radio>
              <el-radio :label="0">未激活账户</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row slot-scope="scope" slot="status">
            <el-switch v-model="scope.row.status" @change='((isChecked)=>{enabledChange(isChecked,scope.row.userId)})'>
            </el-switch>
          </el-row>
          <el-row slot-scope="scope" slot="createTime">
            {{scope.row.createTime.substr(0,19).replace('T',' ')}}
          </el-row>
        </dataTable>
      </el-col>
    </el-row>
    <userEdit @initData="initData" :dialogState="dialogState"></userEdit>
  </div>
</template>
<script>
import dataTable from '@/components/Table/dataTable'
import userEdit from './userEdit.vue'
import services from '@/api/user'
export default {
  name: 'userManage',
  components: {
    dataTable,
    userEdit
  },
  data() {
    return {
      columnDatas: [
        {
          name: '用户名',
          id: 'userName'
        },
        {
          name: '真实姓名',
          id: 'name',
          length: 60
        },
        {
          name: '所属机构',
          id: 'userCompany',
          length: 60
        },
        {
          name: '是否启用',
          id: 'status',
          slot: 'status',
          length: 60
        },
        {
          name: '创建时间',
          id: 'createTime',
          slot: 'createTime',
          length: 60
        }
      ],
      tableInfo: {},
      pageSize: 20,
      pageNumber: 1,
      status: 1,
      dialogState: {
        show: false,
        type: 'add',
        formData: {},
        roleData: []
      },
      queryParams:{
        pageSize:20,
        pageNumber: 1,
        queryKey: '',
        queryColumn: ''
      }
    }
  },
  mounted() {
    this.initData()
    // this.getRoleData()
  },
  methods: {
    getRoleData() {
      services.getRoleList().then(res => {
        if (res && res.data && res.data.data) {
          let data = res.data.data
          this.dialogState.roleData = data
        }
      })
    },
    initData() {
      var params = new FormData()
      params.append('pageSize', this.pageSize)
      params.append('currentPage', this.pageNumber)

      services.getUserList(this.queryParams).then(res => {
        if (res.data && res.data.data) {
          this.tableInfo = res.data
        }
      })
    },
    changeRadio(val){
      this.status = val
      this.initData()
    },
    pageChange(val) {
      this.pageNumber = val
      this.initData()
    },
    pageSizeChange(val) {
      this.pageNumber = 1
      this.pageSize = val
      this.initData()
    },
    handleAdd() {
      this.dialogState.type = 'add'
      this.dialogState.formData = {}
      this.dialogState.show = !this.dialogState.show
    },
    handleEdit(val) {
      this.dialogState.formData = val
      this.dialogState.show = true
      this.dialogState.type = 'edit'
    },
    handleDelete(val, name) {
      this.$confirm('请确认是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var params = new FormData()
          params.append('userId', val)
          this.$ajax.post(this.$adminApi.delUserInfo, params).then(res => {
            if (res.data && res.data.msg == '成功') {
              this.initData(name)
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }else{
               this.$message({
                message: res.data.showMsg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
    },
    enabledChange(status, id) {
      this.$confirm(
        `确定${!status ? '禁用' : '启用'}该用户, 是否继续?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        var params = new FormData()
        params.append('userId', id)
        params.append('type', Number(status))
        this.$ajax.post(this.$adminApi.enableUser, params).then(res => {
          if (res.data && res.data.data) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.initData()
          }
        })
      }).catch(()=>{})
    }
  }
}
</script>
