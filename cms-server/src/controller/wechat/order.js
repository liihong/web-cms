const Base = require('../base.js');
const util = require('../../../utils/util');
const https = require('https');

module.exports = class extends Base {
  async indexAction() {
  }

  // 用户下单
  async addOrderAction() {
    const form = this.post();
    form.id = util.getUUId();
    const data = await this.model('wechat_order').add(form);
    const payStatus = await this.wxPayOrder(form, form.openId);
    data.payStatus = payStatus;
    return this.success(data);
  }

  // 用户支付
  async getPayNoticeAction() {

  }

  async wxPayOrder(orderRecord, openId) {
    const wechatConfig = this.config('wechat');
    // 这里是用用的thinkjs service 实现的。
    const wxpay = this.service('weixinpay', {
      // 公众号appid
      appid: wechatConfig.value,
      // 商户号
      mch_id: wechatConfig.mchid,
      // 交易密钥
      key: wechatConfig.secret,
      // 用户的openid,至于如何拿到是公众号开发的那部分，这里不描述了。
      openid: wechatConfig.openId
    });
      // 创建支付订单
    const notifyUrl = 'https://www.letonglexue.com/api/wechat/order/getPayNotice';
    // 生成支付随机码，并更新
    const orderNonceStr = util.getUUId().toString().replace(/-/g, '');
    // 提前存储，后续校验
    await this.model('wechat_orders').where({id: orderRecord.id}).update({order_noncestr: orderNonceStr, openid: openId});
    orderRecord.noncestr = orderNonceStr;
    // 调用下单接口
    const data = await wxpay.createOrder(orderRecord, this.ctx.ip, notifyUrl);
    console.log(data);
    return data;
  }
};
