<template>
  <div class="item">
    <ResList noAdd tableId="0108" noEdit>
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
      <el-table-column slot="operate" fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group size="mini">
            <el-button @click="uploadItem(scope.row)" size="mini" type="primary">项目</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleDelete(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </ResList>
    <edit-shop :visible.sync="dialogShow.show" />
  </div>
</template>

<script>
import EditShop from './editShop';
export default {
  components:{
    EditShop
  },
  data() {
    return {
      dialogShow: {
        show: false
      }
    };
  },
  methods: {
    addItem() {
      this.$router.push({ name: "shop", query: { type: "add",tableId: '0108' } });
      // this.dialogShow.show = true
    },
    handleEdit(row){
      this.$router.push({ name: "editOrg", query: { type: "edit",id: row.id } });
    }
  }
};
</script>
