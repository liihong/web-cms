<template>
  <div class="item">
    <transition name="fade-transform" mode="out-in">
      <component :is="activeComp" />
    </transition>
  </div>
</template>

<script>
import editClass from './editClass';
import classList from './classList';

export default {
  components:{
    editClass,
    classList
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
        return editClass
      }else {
        return classList
      }
    }
  },
};
</script>
