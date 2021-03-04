<template>
  <div class="types">
    <ResList tableId='0104' noEdit noAdd ref="orgList">
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
      <template slot="org_img" slot-scope="scope">
        <img width="200" height="100" :src="scope.row.org_img" />
      </template>
      <el-table-column slot="operate" fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group size="mini">
            <el-button @click="uploadTZ(scope.row)" size="mini" type="primary">图片</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="$refs.orgList.handleDelete(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </ResList>
    <uploadImg :dialogState="dialogState"/>
  </div>
</template>

<script>
import uploadImg from './uploadImg'

export default {
  components:{
    uploadImg
  },
  data() {
    return {
      dialogShow: {
        show: false
      },
      dialogState: {
        row: {},
        show: false
      },
    };
  },
  methods:{
     addItem() {
      this.$router.push({ name: "orgs", query: { type: "add",tableId: '0108' } });
    },
    // 上传图片
    uploadTZ(row) {
      this.dialogState.row = row
      this.dialogState.show = true
    },
    handleEdit(row){
      this.$router.push({ name: "orgs", query: { type: "edit",id: row.id } });
    }
  }
}
</script>
