// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './assets/css/global.css'
import '../src/plugins/element'
import 'element-ui/lib/theme-chalk/index.css'
import '../src/assets/font/iconfont.css'
import axios from 'axios'
//import * as echarts from 'echarts';
//Vue.prototype.$echarts = echarts
import TreeTable from 'vue-table-with-tree-grid'

Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false
Vue.component('tree-table', TreeTable)
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
