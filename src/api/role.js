import request from '@/utils/request'
let services = {}

services.getDetailById = function (id) {
  return request({
    url: '/role/getDetailById',
    method: 'get',
    params: {
      id
    }
  })
}

services.getResByRoleId = function (form) {
  return request({
    url: '/role/getResByRoleId',
    method: 'get',
    params: form
  })
}
// 获取资源树型数据
services.getTreeList = function () {
  return request({
    url: '/role/getTreeList',
    method: 'get'
  })
}
services.saveRoleRes = function (form) {
  return request({
    url: '/role/saveRoleRes',
    method: 'POST',
    data: form
  })
}

export default services