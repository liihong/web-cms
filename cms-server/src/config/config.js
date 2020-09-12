// default config
module.exports = {
  workers: 1,
  port: 9000,
  errnoField: 'status', // errno field
  errmsgField: 'msg', // errmsg field
  defaultErrno: 200, // default errno
  validateDefaultErrno: 500, // validate default errno
  wechat: {
    baseURL: 'https://api.weixin.qq.com',
    appid: 'wxbbdb53e6cf203e84',
    secret: '6b5f7090634dfec5d43c37d93f589c8c',
    mchid: '1601147329', // 微信商户号
    key: '4a9f2c433adcc2698ba7704faedeaf82' // 微信商户秘钥
  }
};
