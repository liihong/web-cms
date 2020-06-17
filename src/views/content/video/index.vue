<template>
  <div class="video">
    <ResList noAdd tableId='0103'>
       <span slot="toolBar">
        <el-button icon="el-icon-circle-plus-outline" type="success" @click="addVideo">新增</el-button>
      </span>
    </ResList>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  },
  methods:{
    addVideo(){
      this.$router.push({path:'/editVideo',query:{type:'add'}})
    }
  }
}
</script>
