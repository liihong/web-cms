<template>
  <div class="item">
    <ResList noAdd tableId="0108">
      <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addItem">新增</el-button>
      </span>
    </ResList>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    addItem() {
      this.$router.push({ name: "addItem", params: { type: "add",tableId: '0108' } });
    }
  }
};
</script>
