import request from '@/utils/request'
const shopServices = {
  // 获取表格资源数据
  addShop (params) {
    return request({
      url: '/wechat/shop/addShop',
      method: 'post',
      data: params
    })
  },
  editShop (params) {
    return request({
      url: '/wechat/shop/editShop',
      method: 'post',
      data: params
    })
  },
  getShopDetailById (params) {
    return request({
      url: '/wechat/shop/getShopDetailById',
      method: 'get',
      params: params
    })
  }
}

export default shopServices