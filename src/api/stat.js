import request from '@/utils/request'
const statServices =  {
    // 获取表格资源数据
    getStatData() {
        return request({
            url: '/stat/getStatData',
            method: 'get'
        })
    },
}

export default statServices