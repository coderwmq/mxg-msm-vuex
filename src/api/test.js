import request from "@/utils/request";

// request.get('/db.json').then(response => {
//   console.log(response.data);
// })

// 测试2，以对象配置的方式进行指定的请求方式
// axios(config)

const BASE_URL=process.env.VUE_APP_BASE_API
request({
  method: 'get',
  // url: BASE_URL+'/db.json'
  url:'/db.json',/* 这个url变成了 /dev-api/db.json */
}).then(response => {
  // console.log(response.data);
})
export default {
  getList() {
    const req = request({
      method: 'get',
      url: '/db.json'
    })
    return req
  }
}