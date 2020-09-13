<template>
  <div class="item">
    <component :is="activeComp" />
  </div>
</template>

<script>
import editOrg from './editOrg';
import orgList from './orgList';

export default {
  components:{
    editOrg,
    orgList
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
      if(this.$route.query.type === 'add' || this.$route.query.type === 'edit'){
        return editOrg
      }else {
        return orgList
      }
    }
  },
};
</script>
