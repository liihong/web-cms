const Base = require('./base.js');

module.exports = class extends Base {
  indexAction() {
    return this.display();
  }

  async getStatDataAction() {
    const userCount = await this.model('wechat_users').count();
    const newUserCount = await this.model('wechat_users').where('date(create_time) = curdate()').count();
    const orgCount = await this.model('wechat_orgs').count();
    const shopCount = await this.model('wechat_shop').count();
    const orderTotalMoney = await this.model('wechat_orders').where({order_status: ['!=', '1201']}).sum('order_price');
    const orderTodayCount = await this.model('wechat_orders').where('date(order_create_time) = curdate()').count();
    const orderTodayMoney = await this.model('wechat_orders').where('date(order_create_time) = curdate()').sum('order_price');

    const orderCount = await this.model('wechat_orders').count();
    return this.success({
      userCount,
      newUserCount,
      orgCount,
      shopCount,
      order: {
        orderCount,
        orderTodayCount,
        orderTotalMoney,
        orderTodayMoney: orderTodayMoney === null ? 0 : orderTodayMoney
      }
    });
  }
};
