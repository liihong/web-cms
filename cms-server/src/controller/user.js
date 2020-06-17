const Base = require('./base.js');
const util = require('../../utils/util')
let userModel = 'cms_user'
module.exports = class extends Base {
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
        let data = await this.model(userModel).page(pageNumber, pageSize).where(whereObj).countSelect();
        return this.success(data)
    }
    // 处理登录
    async loginAction() {
        try {
            let model = this.model(userModel)
            let ip = this.ip;
            let data = await model.where({
                username: this.post('username'),
                password: this.post('password')
            }).find()
            if (JSON.stringify(data) !== '{}') {
                // 更新在线状态
                let affectedRows = await model.where({
                    id: data.id
                }).update({
                    lastlogintime: new Date().toLocaleString(),
                    token: data.id,
                    ip: ip.split(':')[3]
                });
                data = await model.where({
                    id: data.id
                }).find()
                return this.success(data)
            } else {
                return this.fail(1000, '用户名或密码错误', {})
            }
        } catch (ex) {
            return this.fail(ex)
        }

    }
    // 注销登录
    async logoutAction() {
        try {
            let model = this.model(userModel)
            let affectedRows = await model.where({
                token: this.get('token')
            }).update({
                token: '',
                ip: ''
            });
            return this.success(affectedRows)
        } catch (ex) {
            return this.fail(ex)
        }
    }
    // 通过id获取用户信息
    async infoAction() {
        try {
            let roless = []

            let userData = await this.model(userModel).where({
                id: this.get('token')
            }).find()
            // 获取用户权限
            // if(data.roles) {
            //     let roles = await this.model('cms_role_resource').field(['resId']).where({
            //         roleId: data.roles
            //     }).select()
            //     roles.forEach(element => {
            //         roless.push(element.resId)
            //     });
            // }
            userData.roles = [userData.roles]
            let data = {
                loginState: true,
                noticeCounts: 0,
                userInfo: userData
            }
            return this.success(data)
        } catch (ex) {
            return this.fail(2000, '权限获取失败！', {})
        }
    }
    // 获取当前用户的菜单权限列表
    async menuAction() {
        try {
            let roless = []

            let data = await this.model('cms_resource').join('cms_role_resource ON cms_resource.resId=cms_role_resource.resId').where({
                roleId: this.get('token')
            }).select()
            return this.success(data)
        } catch (ex) {
            return this.fail(2000, '菜单获取失败！', {})
        }
    }
};