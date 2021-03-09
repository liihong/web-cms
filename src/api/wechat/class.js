import request from '@/utils/request'
const classServices =  {
    // 获取表格资源数据
    addClass(params) {
        return request({
            url: '/wechat/class/addClass',
            method: 'post',
            data: params
        })
    },
    editClass(params) {
      return request({
          url: '/wechat/class/editClass',
          method: 'post',
          data: params
      })
    },
    getClassInfoById(params){
      return request({
        url: '/wechat/class/getClassInfoById',
        method: 'get',
        params: params
      })
    },
    getOrgList(){
    return request({
        url: '/wechat/class/getOrgList',
        method: 'get',
      })
    }
}

export default classServices