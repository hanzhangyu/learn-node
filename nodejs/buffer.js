/**
 * Buffer独立于V8的堆内存，由nodejs中C++层实现内存申请
 * @type {module:fs}
 */
const fs = require('fs');
const path = require('path');
/**
 * @desc 设置highWaterMark限制单次读取的最大字节数
 * @out: 床前明��光，疑���地上霜。举头��明月，���头思故乡。
 */
const rs = fs.createReadStream(path.resolve(__dirname, '../assets/test.md'), {
  highWaterMark: 11
});
let data = '';
rs.on('data', function(chunk) {
  data += chunk;
});
rs.on('end', function() {
  // 中文字在UTF8下占3个字节，每次读取11个字节，造成部分字被截断
  console.log(data);
});

/**
 * @desc 设置highWaterMark限制单次读取的最大字节数
 */
