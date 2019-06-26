const vm = require('vm');
const script = new vm.Script(`
function add(a, b) {
  return a + b;
}
const x = add(1, 2);
console.log(x);
`);

// region 未执行上脚本，导致x不存在
const cacheWithoutX = script.createCachedData();
try {
  new vm.Script(`console.log('cacheWithoutX', x)`, {
    cachedData: cacheWithoutX
  }).runInThisContext();
} catch (e) {
  console.error(e);
}
// endregion

// region 执行上一个脚本生成x变量
script.runInThisContext();
const cacheWithX = script.createCachedData();
new vm.Script(`console.log('cacheWithX', x)`, {
  cachedData: cacheWithoutX
}).runInThisContext();
// endregion

console.log(JSON.stringify(cacheWithoutX));
console.log(JSON.stringify(cacheWithX));
