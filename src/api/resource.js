import request from '@/utils/request'
let services = {}
// 获取用户列表
services.getList = function() {
  return request({
    url: '/resource',
    method: 'get'
  })
}
// 修改资源
services.updateResource = function(form) {
  return request({
    url: '/resource/update',
    method: 'post',
    data: { form }
  })
}

services.addResource = function(form) {
  return request({
    url: '/resource/add',
    method: 'post',
    data: { form }
  })
}
// 删除资源
services.delResource = function(resId) {
  return request({
    url: '/resource/delete',
    method: 'post',
    data: { resId }
  })
}

export default services