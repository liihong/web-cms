<template>
  <div class="types">
    <ResList tableId='0105' noAdd noEdit>
        <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
       <template slot="class_name" slot-scope="scope">
        <a :href="scope.row.class_video" target="_blank" >{{scope.row.class_name}}</a>
      </template>
        <template slot="class_isHot" slot-scope="scope">
        <el-tag v-if="scope.row.class_isHot === '1'" type="success">是</el-tag>
        <el-tag v-else type="danger">否</el-tag>
      </template>
      <el-table-column slot="operate" fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group size="mini">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="$refs.orgList.handleDelete(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </ResList>
  </div>
</template>

<script>

export default {
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
      this.$router.push({ name: "class", query: { type: "add",tableId: '0108' } });
    },
    // 上传图片
    uploadTZ(row) {
      this.dialogState.row = row
      this.dialogState.show = true
    },
    handleEdit(row){
      this.$router.push({ name: "class", query: { type: "edit",id: row.id } });
    }
  }
}
</script>
