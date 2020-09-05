<template>
  <div class="item">
    <ResList noAdd tableId="0108">
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
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
      // this.$router.push({ name: "shop", params: { type: "add",tableId: '0108' } });
      this.dialogShow.show = true
    }
  }
};
</script>
