<template>
  <div class="item">
    <component :is="activeComp" />
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
    activeComp(){
      console.log(this.$route.query.type)
      if(this.$route.query.type === 'add' || this.$route.query.type === 'edit'){
        return EditShop
      }else {
        return shopList
      }
    }
  },
};
</script>
