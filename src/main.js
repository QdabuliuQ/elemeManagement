import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';  // 引入elementUI
import 'element-ui/lib/theme-chalk/index.css';  // 引入css

import "nprogress/nprogress.css"  // 导入进度条样式

Vue.use(ElementUI);  // 安装elementUI

import "assets/css/base.css"  // 引入全局样式
import "assets/icon/common.css"  // 全局字体图标
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
