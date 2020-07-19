/**
 * 工具类
 */
const crypto = require('crypto');

module.exports = {

  encrypt: function(data, key) { // 密码加密
    const cipher = crypto.createCipher('bf', key);
    let newPsd = '';
    newPsd += cipher.update(data, 'utf8', 'hex');
    newPsd += cipher.final('hex');
    return newPsd;
  },

  decrypt: function(data, key) { // 密码解密
    const decipher = crypto.createDecipher('bf', key);
    let oldPsd = '';
    oldPsd += decipher.update(data, 'hex', 'utf8');
    oldPsd += decipher.final('utf8');
    return oldPsd;
  },
  // 根据日期获取id
  getUUId: function() {
    let uuid = ''; // 订单号
    for (var i = 0; i < 6; i++) // 6位随机数，用以加在时间戳后面。
    {
      uuid += Math.floor(Math.random() * 9);
    }
    uuid = new Date().getTime() + uuid; // 时间戳，用来生成订单号。
    return uuid;
  },
  getNowTime: function() {
    const now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    if (month > 0 && month < 10) {
      month = '0' + month;
    }
    if (day > 0 && day < 10) {
      day = '0' + day;
    }
    return now.getFullYear().toString() + '-' + month.toString() + '-' + day + '-' + hour + ':' + minutes + ':' + seconds;
  },
  // 小写转换
  lowerJSONKey(jsonObj) {
    for (var key in jsonObj) {
      jsonObj[key.toLowerCase()] = jsonObj[key];
      delete (jsonObj[key]);
    }
    return jsonObj;
  },

  // 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
  getDistance: function(lat1, lng1, lat2, lng2) {
    var radLat1 = lat1 * Math.PI / 180.0;
    var radLat2 = lat2 * Math.PI / 180.0;
    var a = radLat1 - radLat2;
    var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378.137;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000;
    return s;
  }
};
