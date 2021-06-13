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


Vue.prototype.$http = axios
axios.defaults.baseURL = 'https://getman.cn/echo'
Vue.config.productionTip = false
/* axios.all('*', function (req, res, next) {
  //响应头指定了该响应的资源是否被允许与给定的origin共享。*表示所有域都可以访问，同时可以将*改为指定的url，表示只有指定的url可以访问到资源 
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", " Origin, X-Requested-With, Content-Type, Accept");
  //允许请求资源的方式
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
}); */

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
