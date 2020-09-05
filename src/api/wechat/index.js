import request from '@/utils/request'
const weChatServices =  {
    // 获取表格资源数据
    addShop(params) {
        return request({
            url: '/wechat/shop/addShop',
            method: 'post',
            data: params
        })
    },
}

export default weChatServices