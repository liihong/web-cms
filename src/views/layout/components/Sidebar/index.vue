<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <div style="background-color: rgb(48, 65, 86);" class="main-logo">
      <a href="#/dashboard" class="router-link-exact-active router-link-active">CATCMS</a>
    </div>
    <el-menu :show-timeout="200" :default-active="$route.path" :collapse="isCollapse" mode="vertical" background-color="#304156" text-color="#bfcbd9" active-text-color="#006633">
      <sidebar-item v-for="route in routes" :key="route.name" :item="route" :base-path="route.path" />
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['sidebar']),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
