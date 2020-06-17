const Base = require('./base.js');
import util from '../../utils/util'

let modelName = 'news_centers'

module.exports = class extends Base {
    // 获取资源列表
    async indexAction() {
        let pageSize = this.get('pageSize')
        let pageNumber = this.get('pageNumber')
        let queryColumn = this.get('queryColumn')
        let queryKey = this.get('queryKey')
        let whereObj = {}
        if (!!queryColumn) {
            if(queryKey.includes(',')){
                whereObj[`${queryColumn}`] = ['IN', `${queryKey}`]
            } else {
                whereObj[`${queryColumn}`] = ['like', `%${queryKey}%`]
            }
        }
        let data = await this.model(modelName).join({ table: 'system_dictionaries',  join: 'left', on: ['type', 'id'] }).page(pageNumber, pageSize).where(whereObj).filed(
            "system_dictionaries.name as typeName"
        ).countSelect();
        return this.success(data)
    }
    // 根据id获取新闻详情
    async getNewsByIdAction() {
        let data = await this.model(modelName).where({id: this.get('id')}).find()
        return this.success(data)
    }
    // 新增资源
    async addAction() {
        let resource = this.post('form')
        let lastId = await this.model(modelName).max('id');
        resource.id = lastId+1
        try {
            let result = await this.model(modelName).add(resource);
            return this.success(result);
        } catch (ex) {
            return this.fail(ex)
        }
    }

    async updateAction() {
        let resource = this.post('form')
        console.log(resource)
    }
};