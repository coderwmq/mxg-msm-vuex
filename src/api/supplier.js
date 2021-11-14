import request from '@/utils/request'

export default {
  //获取列表
  getList() {
    return request({
      url: '/supplier/list',
      method: 'get'
    })
  },
  // 分页
  search(page, size, searchMap) {
    return request({
      url: `/supplier/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  // 添加供应商
  add(pojo) {
    return request({
      url: '/supplier',
      method: 'post',
      data: pojo,//写不写都可以
    })
  },
  // 通过id获取供应商信息
  getById(id) {
    return request({
      url: `supplier/${id}`,
      method: 'get',
    })
  },
  // 更新供应商信息
  update(pojo) {
    return request({
      url: `/supplier/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },
  // 根据id删除供应商信息
  deleteById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete'  
    })
  }
}