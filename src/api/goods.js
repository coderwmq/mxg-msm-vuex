import request from '@/utils/request'
export default {
  // 查询数据
  search(page, size, searchMap) {
    return request({
      url: `/goods/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  // 新增商品
  addGoods(pojo) {
    return request({
      url: '/goods',
      method: 'post',
      data: pojo
    })
  },
  // 根据id查询商品信息
  getById(id) {
    return request({
      url: `/goods/${id}`,
      method: 'get'
    })
  },
  // 修改商品信息
  update(pojo) {
    return request({
      url: `/goods/${pojo.id}`,
      method: 'put',
      data: pojo
    })
  },  
  // 根据id删除商品
  deleteById(id){
    return request({
      url:`/goods/${id}`,
      method:'delete',
    })
  }
}