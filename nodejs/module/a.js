console.log('a 开始');
exports.done = false;
const b = require('./b.js');
exports.run = function() {
  console.log('a run');
};
console.log('在 a 中，b.done = %j', b.done);
exports.done = true;
console.log('a 结束');
// require.cache[require('path').resolve(__dirname, './b.js')] = null; // 清空cache让b重新加载，即会再编译一遍b
// require.cache[require.resolve('./b.js')] = null; // require.resolve去查询模块的位置并返回绝对路径，不会加载。如果不存在会报错
// console.log(require.resolve.paths('not-exist-module')); // 返回一个数组，其中包含解析 request 过程中被查询的路径。 如果 request 字符串指向核心模块（例如 http 或 fs），则返回 null。
// exports = { hello: false };  // 不导出，仅在模块中可用。
