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
      return this.$route.query || 'list'
    }
  },
  mounted(){
    console.log(this.pageType)
  },
  methods: {
    addItem() {
      this.$router.push({ name: "shop", params: { type: "add",tableId: '0108' } });

      // this.dialogShow.show = true
    }
  }
};
</script>
