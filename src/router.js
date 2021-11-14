import Vue from "vue";
import VueRouter from "vue-router";
// import Login from './views/login/index.vue'
// 下面情况，默认的会导入./views/login目录下面的index.vue文件
// 注意：只有叫index.vue时才会自动导入，其他名称则需要把文件路径写全
import Login from './views/login'
import Layout from '@/components/Layout'
import Home from '@/views/home'
import Member from '@/views/member'
import Staff from '@/views/staff'
import Supplier from '@/views/supplier'
import Goods from '@/views/goods'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/login',
      name: 'login',/* 路由名称 */
      component: Login,/* 组件对象 */
    },
    {
      path: '/',
      name: 'layout',
      redirect: '/home',
      component: Layout,     
      children: [
        {
          path: '/home',
          component: Home,
          meta: { title: '首页' }
        },
        // {
        //   path: '/member',
        //   component: Member,
        //   meta: { title: '会员管理' }
        // },
        // {
        //   path: '/staff',
        //   component: Staff,
        //   meta: { title: '员工管理' }
        // },
        // {
        //   path: '/supplier',
        //   component: Supplier,
        //   meta: { title: '供应商管理' }
        // },
        // {
        //   path: '/goods',
        //   component: Goods,
        //   meta: { title: '商品管理' }
        // },
      ]
    },
    {
      path: '/member',/* 这个地方命名 好像可以随意 */
      component: Layout,
        children: [
          {
            path: '/',/* 简写 / 等价于/member/ 这个地方命名必须要和导航里的一样*/
            component: Member,
            meta: { title: '会员管理' }
          }
        ]
    },
    {
      path: '/supplier',
      component: Layout,
      children: [
        {
          path: '/',/* 简写 / 等价于/supplier/ */
          component: Supplier,
          meta: { title: '供应商管理' }
        }
      ]
    },
    {
      path: '/goods',
      component: Layout,
      children: [
        {
          path: '/',/* 简写 / 等价于/goods/ */
          component: Goods,
          meta: { title: '商品管理' }
        }
      ]
    },
    {
      path: '/staff',
      component: Layout,
      children: [
        {
          path: '/',/* 简写 / 等价于/staff/ */
          component: Staff,
          meta: { title: '员工管理' }
        }
      ]
    },
  ]
})
