<template>
  <div class="types">
    <ResList tableId='0104'>
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
      <template slot="org_img" slot-scope="scope">
        <img width="200" height="100" :src="scope.row.org_img" />
      </template>
    </ResList>
    <edit-org :visible.sync="dialogShow.show" />
  </div>
</template>

<script>
import EditOrg from './editOrg';
export default {
  components:{
    EditOrg
  },
  data() {
    return {
      dialogShow: {
        show: false
      }
    };
  },
  methods:{
     addItem() {
      // this.$router.push({ name: "shop", params: { type: "add",tableId: '0108' } });
      this.dialogShow.show = true
    }
  }
}
</script>
