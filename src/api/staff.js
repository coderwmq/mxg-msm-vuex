import request from '@/utils/request'


export default {
  // 分页查询员工   staff/list/search/{page}/{size}
  queryAllStaff(page, size, searchMap) {
    return request({
      url: `staff/list/search/${page}/${size}`,
      method: 'post',
      data: searchMap
    })
  },
  // 新增用户
  addStaff(pojo){
    return request({
      url:'/staff',
      method:'post',
      data:pojo
    })
  },
  // 根据id查询用户信息
  getStaffById(id){
    return request({
      url:`/staff/${id}`,
      method:'get'
    })
  },
  // 更新修改的信息
  updateStaff(pojo){
    return request({
      url:`/staff/${pojo.id}`,
      method:'put',
      data:pojo
    })
  },
  // 删除用户信息
  deleteStaffById(id){
    return request({
      url:`/staff/${id}`,
      method:'delete'
    })
  }
}