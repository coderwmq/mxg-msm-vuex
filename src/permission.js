/**
 * 权限校验：
 * Vue Router中的 前置钩子函数beforeEach(to,from,next)
 * 当进行路由跳转之前，进行判断是否已经登陆过，登陆过则允许访问非登陆页面，否则回到登录页
 * to:目标路由对象
 * from:离开路由对象 
 */
// 1.获取token
// 1.1如果没有获取到，要访问非登录页面，则不让访问，加到登录页面/login，否则直接next()
// 1.2获取到token
// 1.2.1请求路由/login ,那就去目标路由
// 1.2.2请求路由非登陆页面，就通过token去获取用户信息
// 如果获取到用户信息，则进行非登录页面，否则回到登陆页面
import router from './router'
import { getUserInfo } from './api/login'   //按需导入必须加花括号 不然找错找到死
import store from './store'

router.beforeEach((to, from, next) => {
  // 获取token
  // const token = localStorage.getItem('mxg-msm-token')
  const token = store.state.user.token
  if (!token) {//没有token
    if (to.path !== '/login') {//访问的不是登陆页面
      next({
        path: '/login',//强制用户进入登录页面
      })
    } else {//访问的是登陆页面
      next()//直接去登陆页面
    }
  } else {//获取到了token
    if (to.path === '/login') {//访问的是login页面
      next()//直接去login页面
    } else {//访问的不是login页面
      // const userInfo = localStorage.getItem('mxg-msm-user')//获取本地用户信息
      const userInfo = store.state.user.user//获取本地用户信息
      if (userInfo) {//如果有本地用户信息
        next()//去哪个页面都可以
      } else {//如果没有本地用户信息,则查询一下

        store.dispatch('GetUserInfo').then((response) => {
          if (response.flag) {
            next()
          }else{
            next({
              path:'/login'
            })
          }
        }).catch(error => {

        })


        // console.log(token);//这里还能获取到token
        // getUserInfo(token).then(response => {
        //   const resp = response.data
        //   if (resp.flag) {//如果有本地用户信息，则保存本地用户信息并放行
        //     localStorage.setItem('mxg-msm-user',JSON.stringify(resp.data))
        //     next()
        //   } else {//没有查到用户信息，直接去login界面
        //     next({
        //       path: '/login'
        //     })
        //   }
        // })
      }
    }
  }

})