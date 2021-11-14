import request from '../utils/request'

export default {
  // 获取会员列表数据
  getMemberList() {
    return request({
      url: '/member/list',
      method: 'get'
    })
  },
  // 分页搜索方法
  // page当前页码，size每页查询条数，searchMap条件查询的条件值
  search(page, size, searchMap) {
    return request({
      url: `/member/search/${page}/${size}`,
      method: 'post',
      data: searchMap,//  `data` 是作为请求主体被发送的数据
    })
  },
  // 添加会员信息
  add(pojo) {
    return request({
      url: '/member',
      method: 'post',
      data: pojo
    })
  },
  // 通过id查询会员信息
  getById(id){
    return request({
      url:`/member/${id}`,
      method:'get'
    })
  },
  // 更新数据
  update(pojo){
    return request({
      url: `/member/${pojo.id}`,
      method:'put',
      data:pojo
    })
  },
  // 删除会员
  deleteById(id){
    return request({
      url:`/member/${id}`,
      method:'delete'
    })
  }

}