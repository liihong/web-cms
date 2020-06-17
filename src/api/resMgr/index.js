import request from '@/utils/request'
let resMgrServices = {}
export default resMgrServices = {
    // 获取表格资源数据
    getTableData(params) {
        return request({
            url: '/resMgr/tableData/queryTableData',
            method: 'get',
            params: params
        })
    },
    // 获取表格资源配置信息
    getTableColumns(params) {
        return request({
            url: '/resMgr/resTableColumn/getTableColumn',
            method: 'get',
            params: params
        })
    },
    // 获取字典
    getDropDownListData(params) {
        return request({
            url: '/resMgr/resTableColumn/getDropDownListData',
            method: 'get',
            params: params
        })
    },

    // 获取外键数据列表
    getForeingKeyListData(params) {
        return request({
            url: '/resMgr/resTableColumn/getForeingKeyListData',
            method: 'get',
            params: params
        })
    },
    //新增数据
    addTableData(params) {
        return request({
            url: 'resMgr/tableData/add',
            method: 'post',
            data: params
        })
    },
    //编辑数据
    editTableData(params) {
        return request({
            url: 'resMgr/tableData/edit',
            method: 'post',
            data: params
        })
    },
    //删除数据
    deleteTableData(params) {
        return request({
            url: 'resMgr/tableData/delete',
            method: 'post',
            data: params
        })
    },

    // 通过ID查询某一张表的某一条数据
    queryDataById(params) {
        return request({
            url: 'resMgr/tableData/queryTableDataById',
            method: 'get',
            params: params
        })
    },
    //删除某个外键表的数据
    DeleteForeingDataById(params) {
        return request({
            url: 'resMgr/resTableColumn/DeleteForeingDataById',
            method: 'get',
            params: params
        })
    },
    //Excel数据导出
    exportExcel(params) {
        return request.getBolb('/api/resMgr/tableData/exportExcel',
            params
        )
    }
}