import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import '@/styles/element-ui.scss'
import '@/styles/index.scss' // global cs
import '@/styles/reset.css' // global cs
import message from '@/utils/message'

import '@/icons' // icon
import '@/permission' // permission control
// 国际化
import VueI18n from 'vue-i18n'
// 引用三种语言
import zhCN from './lang/zh'
import en from './lang/en'


Vue.use(VueI18n)
Vue.use(ElementUI, { size: 'mini' })

// 注册公共组件
import ResList from './views/components/ResMgr/ResList.vue'
Vue.component('ResList',ResList)
import ResEdit from './views/components/ResMgr/ResEdit.vue'
Vue.component('ResEdit',ResEdit)
Vue.config.productionTip = false

Vue.prototype.$message = message

const i18n = new VueI18n({
  locale: 'zh',  // 语言标识
  messages: {
      'zh': zhCN,
      'en': en
  }
})

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
