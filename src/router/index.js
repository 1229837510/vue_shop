import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
Vue.use(Router)

const router = new Router({
  routes: [{
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: Login,
    component: Login
  }, {
    path: '/home',
    component: Home
  }]
})

router.beforeEach((to, from, next) => {
  //to将要访问的路径
  //from 代表从那个路径跳转而来
  //next 是一个函数，表示放行
  //next()放行，next('/login')
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
