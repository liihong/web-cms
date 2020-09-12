<template>
  <div class="item">
    <EditShop v-if="pageType && pageType==='add'"/>
    <shopList v-else />
  </div>
</template>

<script>
import EditShop from './editShop';
import shopList from './shopList';

export default {
  components:{
    EditShop,
    shopList
  },
  data() {
    return {
      dialogShow: {
        show: false
      }
    };
  },
  computed:{
    pageType(){
      return this.$route.query.type || 'list'
    }
  },
  mounted(){
    console.log(this.pageType)
  },
};
</script>
