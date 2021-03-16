<template>
  <div class="item">
    <ResList noAdd tableId="0108" noEdit ref="shop">
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
      <el-table-column slot="operate" fixed="right" label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button-group size="mini">
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="primary" @click="$refs.shop.handleDelete(scope.row)">删除</el-button>
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
      dialogState:{
        show: false,
        query:null
      }
    };
  },
  methods: {
    addItem() {
      this.$router.push({ name: "shop", query: { type: "add",tableId: '0108' } });
    },
    handleEdit(row){
      this.$router.push({ name: "shop", query: { type: "edit",id: row.id } });
    },
    editItem(row){
      this.dialogState.query = {item_shop:row.id}
      this.dialogState.show = true
    }
  }
};
</script>
