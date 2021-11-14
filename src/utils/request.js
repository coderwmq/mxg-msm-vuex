import axios from 'axios'
import { Loading, Message } from 'element-ui'


const loading = {
  loadingInstance: null,//Loading实例
  // 打开加载
  open: function () {
    // 创建实例，而且会打开加载窗口  单例模式
    if (this.loadingInstance === null) {
      this.loadingInstance = Loading.service({
        target: '.main',
        // fullscreen:false, 是否全屏加载
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.8)'
      })
    }
  },
  // 关闭加载
  close: function () {
    // 不为空是，则关闭加载窗口
    if (this.loadingInstance !== null) {
      this.loadingInstance.close()
    }
    this.loadingInstance = null
  }
}
// request就相当于axios
const request = axios.create({
  // /db.json >通过 axios > /dev-api/db.json > 通过代理转发(vue.config.js) > http://localhost:8001/db.json
  baseURL: process.env.VUE_APP_BASE_API,
  // baseURL: '/dev-api',
  // baseURL: '/',
  timeout: '5000',/* 请求超时时间 */
})

// 请求拦截器
request.interceptors.request.use(config => {
  // 打开加载窗口
  loading.open()
  return config
}, error => {
  // 关闭加载窗口
  loading.close()
  // 出现异常 
  return Promise.reject(error)
})
// 响应拦截器
request.interceptors.response.use(response => {
  // response.data
  // 关闭加载窗口
  loading.close()

  const resp = response.data
  // 后台正常响应的状态，如果不是200，说明后台处理有问题
  if (resp.code !== 2000) {
    Message({
      message: resp.message || '系统异常',
      type: 'warning',
      duration: 5 * 1000
    })
  }
  return response
}, error => {
  // 出现异常
  // 关闭加载窗口
  loading.close()
  Message({
    message: error.message,
    type:'error',
    duration: 5 * 1000
  })
  return Promise.reject(error)
})
// request.get('/db.json').then(response => {
//   console.log(response.data);
// })

export default request //导出自定义创建的axios对象