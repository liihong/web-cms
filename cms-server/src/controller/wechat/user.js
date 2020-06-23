const Base = require('../base.js');
const util = require('../../../utils/util')
let userModel = 'wechat_users'
const https = require('https')
module.exports = class extends Base {

    // 微信登录接口
    async loginAction() {
        try {

            let wxcode = this.post('wxcode')
            let wxavatar = this.post('wxavatar')

            let model = this.model(userModel)
            let ip = this.ip;
            let data = await model.where({
                openid: this.post('openid')
            }).find()

            //根据openID查询数据库中是否有该用户，如果有直接返回用户信息，没有则录入用户信息
            if(JSON.stringify(data) === "{}"){
                let openId = await this.getOpenId(wxcode)
                let userInfo = {
                    id:util.getUUId(),
                    name:''
                }
            }else{
                return this.success(data)
            }

        } catch (ex) {
            return this.fail(500, '用户名或密码错误', '用户名或密码错误')
        }
    }

    getOpenId(wxcode) {
        return new Promise(async resolve => {
            let openId = ''
            let wechatConfig = this.config.wechat
            https.get(`${wechatConfig.baseURL}/sns/jscode2session?appid=${wechatConfig.appid}&secret=${wechatConfig.secret}&js_code=${wxcode}&grant_type=authorization_code`, (resp) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    data = JSON.parse(data);
                    console.log(data)
                    openId = data.openid
                    resolve(openId)
                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });
        })
    }
};