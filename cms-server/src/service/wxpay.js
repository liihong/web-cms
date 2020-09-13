/**
 微信支付-thinkjs3.0
***/

const axios = require('axios');
const crypto = require('crypto');
const xml2json = require('xml2json');
const moment = require('moment');
const md5 = require('blueimp-md5');
const { format } = require('path');

module.exports = class extends think.Service {
  constructor(opts) {
    super();
    this.opts = opts || {
      appid: 'wxbbdb53e6cf203e84',
      mch_id: '1601147329',
      key: '4a9f2c433adcc2698ba7704faedeaf82'
    };
  }

  // 根据对象生成微信支付xml数据
  __createXML(object) {
    let str = `<xml>`;
    for (const key in object) {
      str += '<' + key + '>' + (typeof object[key] === 'object' ? ('<![CDATA[' + JSON.stringify(object[key]) + ']]>') : object[key]) + '</' + key + '>';
    }
    return str + '</xml>';
  }
  // 签名校验--统一下单签名
  __createSign(object, key) {
    const paramsArr = [];
    const keyarr = Object.keys(object).sort();
    keyarr.forEach(item => {
      if (object[item] && item != 'sign') {
        paramsArr.push({
          name: item,
          value: typeof object[item] === 'object' ? JSON.stringify(object[item]) : object[item]
        });
      }
    });
    let str = paramsArr.map(item => {
      return item.name + '=' + item.value;
    }).join('&');
    str += '&key=' + key;
    // 做md5
    return crypto.createHash('md5').update(str).digest('hex').toString().toUpperCase();
  }

  __getPaySign(appId, timeStamp, nonceStr, packagee) {
    var stringA = 'appId=' + appId +
        '&nonceStr=' + nonceStr +
        '&package=' + packagee +
        '&signType=MD5' +
        '&timeStamp=' + timeStamp;

    var stringSignTemp = stringA + '&key=' + this.opts.key;
    var sign = md5(stringSignTemp).toUpperCase();
    return sign;
  }
  /***
     * 微信支付查询
     * @param orderId : 系统内部的订单ID
     * @param nonce_str : 随机32位字符串
     */
  async orderQuery(orderId, nonceStr) {
    const url = `https://api.mch.weixin.qq.com/pay/orderquery`;
    const params = {
      appid: this.opts.appid,
      mch_id: this.opts.mch_id,
      out_trade_no: orderId,
      nonce_str: nonceStr,
      sign_type: 'MD5'
    };
    // 签名认证
    const sign = this.__createSign(params, this.opts.key);
    params.sign = sign;
    // 创建xml字符串
    const xml = this.__createXML(params);

    const resultData = await axios.post(url, xml).then(rs => rs.data);
    // xml 转 json
    let resultObject = xml2json.toJson(resultData);
    resultObject = JSON.parse(resultObject);
    // 处理返回结果
    return resultObject;
  }
  /**
     *
     * 创建微信支付统一订单
     *
     ***/
  async createOrder(orderRecord, ip, notifyUrl) {
    const url = `https://api.mch.weixin.qq.com/pay/unifiedorder`;
    const times = +new Date();
    const starttime = moment(times).format('YYYYMMDDHHmmss');
    const endtime = moment(times + (5 * 50 * 1000)).format('YYYYMMDDHHmmss');
    const params = {
      // 公众号appid
      appid: this.opts.appid,
      // 商户号
      mch_id: this.opts.mch_id,
      // 设备号
      device_info: 'WEB',
      // 随机字符串
      nonce_str: orderRecord.noncestr,
      // 签名类型
      sign_type: 'MD5',
      // 商品描述-该内容需要按照微信规范写入*****
      body: '乐童乐学-鱼票',
      // 商品详情
      detail: {
        // 订单原价，分
        goods_detail: [
          {
            goods_id: orderRecord.id,
            goods_name: orderRecord.order_item,
            // 商品数量
            quantity: 1,
            // 单价，分
            price: orderRecord.order_price
          }
        ]
      },
      // 附加数据，原样返回
      attach: 'WEB支付[' + orderRecord.noncestr + ']',
      // 商户订单号
      out_trade_no: orderRecord.id,
      // 标价币种
      fee_type: 'CNY',
      // 总金额：最小单位分*****注意
      total_fee: orderRecord.order_price * 100,
      // 终端IP
      spbill_create_ip: ip,
      // 订单生成时间
      time_start: starttime,
      // 订单失效时间，超过5分钟
      time_expire: endtime,
      // 通知地址
      notify_url: notifyUrl,
      trade_type: 'JSAPI',
      // 系统内自定义，商品ID
      // product_id: orderRecord.order_item,
      // 限制不能使用信用卡
      // limit_pay: 'no_credit',
      // 当前付款用户的openid
      openid: orderRecord.order_openId
      // 开票入口，当前不支持开票
      // receipt: 'N'
    };
    // 获得签名
    const sign = this.__createSign(params, this.opts.key);
    params.sign = sign;

    // 获得xml
    const xml = this.__createXML(params);
    // 请求返回数据
    const resultData = await axios.post(url, xml).then(rs => rs.data);

    // 对返回结果进行校验和判断。
    let resultObject = xml2json.toJson(resultData);
    resultObject = JSON.parse(resultObject);

    // 返回成功，获取prepay_id
    if (resultObject.xml.return_code === 'SUCCESS' && resultObject.xml.result_code === 'SUCCESS') {
      const payid = resultObject.xml.prepay_id;
      const timeSamp = moment(times).format('YYYYMMDDHHmmss');
      console.log(resultObject.xml);
      const paySign = this.__getPaySign(this.opts.appid, timeSamp, orderRecord.noncestr, 'prepay_id=' + payid);
      return {
        success: true,
        prepay_id: payid,
        paySign: paySign,
        timeSamp: timeSamp,
        nonceStr: orderRecord.noncestr,
        orderId: orderRecord.id,
        order: orderRecord,
        expiretime: endtime// 支付超期，用于再次进入查询使用
      };
    }

    return {
      success: false,
      msg: resultObject.xml.return_msg
    };
  }
};
