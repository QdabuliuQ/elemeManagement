import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const loginPage = () => import('views/loginPage/LoginPage') // 登录页面
const homePage = () => import('views/homePage/HomePage') // 首页
const userDetail = () => import('views/userDetail/UserDetail') // 用户数据
const usersPage = () => import('views/usersPage/UsersPage') // 用户列表
const shopsPage = () => import('views/shopsPage/ShopsPage') // 商店列表

// 解决重复点击路由保存的问题
const originalPush = VueRouter.prototype.push
//修改原型对象中的push方法
VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect:'/loginPage' },
  { path: '/loginPage', component: loginPage },
  { 
    path: '/homePage', 
    component: homePage,
    children: [
      { path: '/homePage', redirect: '/userDetial' },
      { path: '/userDetial', component: userDetail },
      { path: '/usersPage', component: usersPage },
      { path: '/shopsPage', component: shopsPage },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
