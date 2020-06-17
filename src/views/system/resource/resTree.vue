<template>
  <div class="resource-tree">
    <el-row class="dr-tree">
      <!--工具条-->
      <el-col :span="24" class="toolbar">
        <el-form :inline="true">
          <el-form-item>
            <el-button @click="handleAdd(null)" type="primary" size="small" icon="el-icon-circle-plus">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <el-tree  :render-content="renderContent" ref="tree2" @node-click="treeClick" :data="treeData" :props="defaultProps" class="filter-tree" default-expand-all >
        </el-tree>
      </el-col>
      <el-col class="form" :span="12">
        <el-form ref="form" :model="formdata" label-width="80px">
          <el-form-item label="资源名称">
            <el-input v-model="formdata.resName"></el-input>
          </el-form-item>
          <el-form-item label="资源图标">
            <el-input v-model="formdata.icon"></el-input>
          </el-form-item>
          <el-form-item label="资源标示">
            <el-input v-model="formdata.resKey"></el-input>
          </el-form-item>
          <el-form-item label="资源路径">
            <el-input v-model="formdata.path"></el-input>
          </el-form-item>
          <el-form-item label="是否菜单">
            <el-switch v-model="formdata.ismenu">
            </el-switch>
          </el-form-item>
          <el-form-item label="资源排序">
            <el-input v-model="formdata.resOrder"></el-input>
          </el-form-item>
          <el-form-item label="资源备注">
            <el-input v-model="formdata.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSave">更新</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
     <resForm @initData="initData" :dialogState="dialogState"></resForm>
  </div>
</template>

<script>
import services from '@/api/resource'
import { formatTreeData } from '@/utils'
import resForm from './resForm.vue'
export default {
  components:{
    resForm
  },
  data() {
    return {
      filterText: '',
      treeData: [],
      formdata: {
      },
      dialogState:{
        show: false,
        type: 'add',
        resList: [],
        formData: {
        }
      },
      defaultProps: {
        children: 'children',
        label: 'resName'
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      services.getList().then(res => {
        if (res.data && res.errno == 0) {
          let data = res.data
          this.treeData = formatTreeData(data, 'resId', 'parentId')
          this.dialogState.resList = this.treeData
        }
      })
    },
    handleAdd(data) {
      this.dialogState.type = 'add'
      let parentId = '0'
      if(data != null || data != undefined) {
        parentId = data.resId
      }
      this.dialogState.formData = {
        parentId: parentId
      }
      this.dialogState.show = !this.dialogState.show
    },
    handleDelete(resId) {
        services.delResource(resId).then(res => {
          if (res.data && res.errno == 0) {
            this.$message({
                message: '删除成功',
                type: 'success'
              })
          }
        }) 
        this.initData()  
    },
    treeClick(data) {
      this.formdata = data
    },
    // 保存修改
    onSave() {
      services.updateResource(this.$refs['form'].model).then(res => {
        if (res.data && res.errno == 0) {
           this.$message({
              message: '修改成功',
              type: 'success'
            })
        }
      })
    },
    renderContent(h, { node, data }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
          <span>
            <span>{this.$t(node.label)}</span>
          </span>
          <span style="float: right; margin-right: 20px">
            <el-button type="text" on-click={() => this.handleAdd(data)}>
              <i class="el-icon-circle-plus" aria-hidden="true" />
            </el-button>
            <el-button type="text" on-click={() => this.handleDelete(data.resId)}>
              <i class="el-icon-remove" />
            </el-button>
          </span>
        </span>
      );
    }
  }
}
</script>
<style lang="scss" scoped>
.form {
  padding: 20px;
  border: 1px solid #cccccc;
}
</style>
