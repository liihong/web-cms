import request from '@/utils/request'
const orgServices =  {
    // 获取表格资源数据
    addOrg(params) {
        return request({
            url: '/wechat/org/addOrg',
            method: 'post',
            data: params
        })
    },
    editOrg(params) {
      return request({
          url: '/wechat/org/editOrg',
          method: 'post',
          data: params
      })
  },
    getOrgType(){
      return request({
        url: '/wechat/org/getOrgTypeList',
        method: 'get',
      })
    },
    getOrgInfoById(params){
      return request({
        url: '/wechat/org/getOrgInfoById',
        method: 'get',
        params: params
      })
    },
    deleteImage(params){
      return request({
        url: '/wechat/org/deleteImage',
        method: 'post',
        data: params
      })
    },
    getImgList(params){
      return  request({
        url: '/wechat/org/getImgList',
        method: 'get',
        params: params
      })
    }
}

export default orgServices