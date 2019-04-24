console.log(Object.keys(require.main.exports).length === 0);
exports.done = false;
const cacheSelf = require.cache[module.filename]; // 可以看到找到这个文件就会被写入cache
console.log('module self done:', cacheSelf.exports.done);
exports.done = true;

const a = require('./a');
const b = require('./b'); // 模块只会执行一次

// console.log(require('module').builtinModules); // Node.js 提供的所有模块名称。可以用来判断模块是否为第三方所维护。
