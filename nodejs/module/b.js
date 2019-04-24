console.log('b 开始');
exports.done = false;
const a = require('./a.js');
// a.run(); // 这里不是调用a.run因为a还没解析完
console.log('在 b 中，a.done = %j', a.done);
exports.done = true;
console.log('b 结束');
