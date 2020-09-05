const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
  }
  async getAreaAction() {
    const data = await this.module('common_area').select();

    return this.success(data);
  }

  // 上传图片
  async uploadImageAction() {
    if (!think.isEmpty(this.file('file'))) {
      // 进行压缩等处理
      const file = think.extend({}, this.file('file'));

      // 保存文件的路径
      const savepath = think.ROOT_PATH + '/../upload/images/';
      console.log(savepath);
      // think.mkdir(savepath); // 创建该目录
      const filepath = file.path; // 文件路径
      const filename = file.name; // 文件名
      const suffix = filename.substr(filename.lastIndexOf('.') + 1); // 文件后缀

      // 读文件
      const datas = fs.readFileSync(filepath);
      // 写文件
      fs.writeFileSync(savepath + filename, datas);
      const newpath = savepath + filename;
      file.path = newpath;

      const tzData = {
        id: util.getUUId(),
        ssdd: ssdd,
        tzlx: suffix,
        tzmc: filename,
        tzdz: file.path,
        url: 'upload/ddtz/' + ssdd + '/' + filename
      };
      const data = await this.model('scglxt_t_dd_tz').add(tzData);
      return this.success(data);
    }
  }
};
