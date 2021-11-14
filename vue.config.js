module.exports = {
  // 配置选项，必须是json格式
  // publicPath:'/demo'
  devServer: {
    port: 8888,/* 端口号 如果端口号被占用，会自动提升1 */
    host: 'localhost',/* 主机名 127.0.0.1 真机 0.0.0.0 */
    https: false,/* 协议 */
    open: true,/* 启动服务时自动打开浏览器访问噢 */
    proxy: {//开发环境代理配置 用于解决跨域问题  同源策略：是指协议，域名和端口都要相同，其中有一个不同就会产生跨域     
      [process.env.VUE_APP_BASE_API]: {// '/dev-api': {//请求前缀 /dev-api
        target: process.env.VUE_APP_SERVICE_URL,// 目标服务器地址,代理访问 https://mock.mengxuegu.com/mock/617e51f6b17b351d1beab4fc
        changeOrigin: true,//开启代理服务器
        pathRewrite: {
          //  /dev-api/db.json 最终会发送http://localhost:8001/db.json
          // 将请求地址前缀 /dev-api 替换为空的
          // '^/dev-api': ''
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
  },
  lintOnSave: false,/* 关闭格式检查 */
  productionSourceMap: false,/* 打包时不会生成.map文件，加快打包速度 */
  // outputDir:'dist2', //打包之后所在的目录，默认值 dist
  // assetsDir: 'assets',/* 静态资源打包之后存放路径，（相对于outputDir指定的路径） 默认'' */
  // indexPath: 'out/index.html',/* index.html 主页面打包之后存放的目录（相对于outputDir指定的路径）  */
  // filenameHashing:false, 打包时，静态文件不会生成hash值
}