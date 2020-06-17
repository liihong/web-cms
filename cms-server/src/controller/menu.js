const Base = require('./base.js');

let modelName = 'cms_menu'
module.exports = class extends Base {
    // 获取资源列表
    async indexAction() {
        let data = await this.model(modelName).select()
        return this.success(data)
    }
    // 新增资源
    async addAction() {
        let form = this.post('form')
        let lastId = await this.model(modelName).where().max('id');
        if(lastId == null) {
            form.resId = form.parentId + '01'
        }else {
            form.resId = parseInt(lastId)+1
            form.resId = '0' + form.resId
        }
        try {
            let result = await this.model(modelName).add(form);
            return this.success(result);
        } catch (ex) {
            return this.fail(ex)
        }
    }

    async updateAction () {
        let form = this.post('form')
        let id = form.resId
        
        try {
            let result = await this.model(modelName).where({'resId': id}).update(form);
            return this.success(result);
        } catch (ex) {
            return this.fail(ex)
        }
    }
    //删除
    async deleteAction() {
        let resId = this.post('resId')
        try {
            let result = await this.model(modelName).where({'resId': ['like', resId] }).delete();
            return this.success(result);
        } catch (ex) {
            return this.fail(ex)
        }
    }
};