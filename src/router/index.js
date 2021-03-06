import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const loginPage = () => import('views/loginPage/LoginPage') // 登录页面
const homePage = () => import('views/homePage/HomePage') // 首页
const userDetail = () => import('views/userDetail/UserDetail') // 用户数据
const usersPage = () => import('views/usersPage/UsersPage') // 用户列表
const shopsPage = () => import('views/shopsPage/ShopsPage') // 商店列表
const foodsPage = () => import('views/foodsPage/FoodsPage') // 食品列表
const ordersPage = () => import('views/ordersPage/OrdersPage') // 订单列表
const adminsPage = () => import('views/adminsPage/AdminsPage') // 订单列表
const addShopPage = () => import('views/addShopPage/AddShopPage') //添加商店
const addFoodPage = () => import('views/addFoodPage/AddFoodPage') //添加食品
const chartsDetail = () => import('views/chartsDetail/ChartsDetail') //用户分布

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
      { path: '/foodsPage', component: foodsPage },
      { path: '/ordersPage', component: ordersPage },
      { path: '/adminsPage', component: adminsPage },
      { path: '/addShopPage', component: addShopPage },
      { path: '/addFoodPage/:restID', component: addFoodPage },
      { path: '/chartsDetail', component: chartsDetail },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
