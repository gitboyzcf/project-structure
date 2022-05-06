import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

// 核心插件
import corePlugins from "@/plugin/other";
Vue.use(corePlugins);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
