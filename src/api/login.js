import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data() {
      return {
        username, //简写形式
        password
      };
    },
  })
}
export function getUserInfo(token) {
  return request({
    url: `/user/info/${token}`,
    method: 'get',
  })
}
export function logout(token) {
  console.log(token);
  return request({
    url: `/user/logout`,
    method: 'post',
    data() {
      return {
        token,
      };
    },
  })
}