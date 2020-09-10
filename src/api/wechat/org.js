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
    getOrgType(){
      return request({
        url: '/wechat/org/getOrgTypeList',
        method: 'get',
      })
    }
}

export default orgServices