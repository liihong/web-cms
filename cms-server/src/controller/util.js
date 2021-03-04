import util from '../../utils/util';
const Base = require('./base.js');
const fs = require('fs');
const path = require('path');

module.exports = class extends Base {
  // 上传图片
  async uploadAction() {
    if (!this.file('file')) {
      return this.fail(500, '文件选择出错');
    }
    const themefile = this.file('file');
    const filepath = themefile.path;// 为防止上传的时候因文件名重复而覆盖同名已上传文件，path是MD5方式产生的随机名称
    const uploadpath = think.ROOT_PATH + '/../upload/images/';
    // let uploadpath = '/upload/';
    think.mkdir(uploadpath);// 创建该目录
    // 提取出用 ‘/' 隔开的path的最后一部分。

    const newFileName = path.basename(filepath);

    // 将上传的文件（路径为filepath的文件）移动到第二个参数所在的路径，并改为第二个参数的文件名。
    themefile.path = 'http://letonglexue.com/upload/images/' + newFileName;
    themefile.name = newFileName;
    fs.rename(filepath, uploadpath + newFileName, function(err) {
      if (err) {
        console.log(err);
      }
    });
    this.success(themefile);
  }
};
