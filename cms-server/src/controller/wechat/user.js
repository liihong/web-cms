const Base = require('../base.js');
const util = require('../../../utils/util');
const userModel = 'wechat_users';
const https = require('https');
module.exports = class extends Base {
  // 微信登录接口
  async loginAction() {
    try {
      const wxcode = this.post('code');
      const wxInfo = await this.getOpenId(wxcode);

      const wechatConfig = this.config('wechat');
      think.config('wechat', {...wechatConfig, ...wxInfo});

      return this.success(wxInfo);
    } catch (ex) {
      return this.fail(500, '用户名或密码错误', '用户名或密码错误');
    }
  }

  async setUserInfoAction() {
    const {info, openId, token} = this.post();

    const userInfo = JSON.parse(info);
    userInfo.session_key = token;
    userInfo.openId = openId;

    const data = await this.model(userModel).where({openId}).select();

    // 根据openId查询数据库中是否有该用户信息，如果有则更新，如果没有则新增
    if (data.length > 0) {
      await this.model(userModel).where({openId}).update(userInfo);
      userInfo.id = data[0].id;
    } else {
      userInfo.id = util.getUUId();
      await this.model(userModel).add(userInfo);
    }

    return this.success(userInfo);
  }

  getOpenId(wxcode) {
    return new Promise(async resolve => {
      const wechatConfig = this.config('wechat');
      const url = `${wechatConfig.baseURL}/sns/jscode2session?appid=${wechatConfig.appid}&secret=${wechatConfig.secret}&js_code=${wxcode}&grant_type=authorization_code`;
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });
        resp.on('end', () => {
          data = JSON.parse(data);
          resolve(data);
        });
      }).on('error', (err) => {
        this.fail(500, 'Error: ' + err.message);
      });
    });
  }
};
