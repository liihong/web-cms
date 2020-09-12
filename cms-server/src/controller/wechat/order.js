const Base = require('../base.js');
const util = require('../../../utils/util');

module.exports = class extends Base {
  async indexAction() {
  }

  // 用户下单
  async addOrderAction() {
    const form = this.post();
    form.id = util.getUUId();
    const data = await this.model('wechat_orders').add(form);
    const payStatus = await this.wxPayOrder(form, form.order_openId);

    return this.success(payStatus);
  }

  // 返回订单列表
  async getOrderListAction() {
    const userId = this.get('userId');
    const status = this.get('status');
    const whereObj = { order_openId: userId };
    // 0 默认全部
    if (status !== '0') {
      whereObj.order_status = status;
    }
    const data = await this.model('wechat_orders').join({ table: 'wechat_items', join: 'left', on: ['order_item', 'id'] }).where(whereObj).select();

    return this.success(data);
  }

  async getOrderDetailAction() {
    const orderId = this.get('id');
    const whereObj = { id: orderId };
    const data = await this.model('wechat_orders').join({ table: 'wechat_items', join: 'left', on: ['order_item', 'id'] }).where(whereObj).select();
    return this.success(data);
  }

  // 更新订单状态
  async updateOrderStatusAction() {
    const orderId = this.post('id');
    const status = this.post('status');
    const whereObj = { id: orderId };
    await this.model('wechat_orders').where(whereObj).update({order_status: status});
    const data = this.model('wechat_orders').where(whereObj).find();
    await this.model('wechat_items').where({id: data.order_item}).increment('item_num', 1);

    return this.success(data);
  }

  // 用户支付
  async getPayNoticeAction() {
    console.log(this.get());
    console.log(this.post());
  }

  async wxPayOrder(orderRecord, openId) {
    const wechatConfig = this.config('wechat');
    // 这里是用用的thinkjs service 实现的。
    const wxpay = this.service('wxpay', {
      // 公众号appid
      appid: wechatConfig.appid,
      // 商户号
      mch_id: wechatConfig.mchid,
      // 交易密钥
      key: wechatConfig.key,
      // 用户的openid,至于如何拿到是公众号开发的那部分，这里不描述了。
      openid: openId
    });
    // 创建支付订单
    const notifyUrl = 'https://letonglexue.com/api/wechat/order/getPayNotice';
    // 生成支付随机码，并更新
    const orderNonceStr = util.getUUId().toString().replace(/-/g, '');
    // 提前存储，后续校验
    await this.model('wechat_orders').where({ id: orderRecord.id }).update({ order_noncestr: orderNonceStr, openid: openId });
    orderRecord.noncestr = orderNonceStr;
    // 调用下单接口
    const data = await wxpay.createOrder(orderRecord, '127.0.0.1', notifyUrl);
    return data;
  }
};
