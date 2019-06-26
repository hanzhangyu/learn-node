const vm = require('vm');
let localVar = 'initial value';
global.globalVar = 'initial global';

// region 在当前的global对象的上下文中编译并执行code，最后返回结果。1. 运行中的代码无法获取本地作用域，2. 但可以获取和修改当前的global对象。相当于vm.runInNewContext(code, global)
const vmResult = vm.runInThisContext(
  'localVar = "vm";globalVar="vm";global.a = 1;'
);
console.log('vmResult:', vmResult);
console.log('localVar:', localVar);
console.log('globalVar:', globalVar);
console.log('global.a:', global.a);
// vmResult: 1', localVar: 'initial value', globalVar: 'vm', global.a: 1
// endregion

// region eval()确实能获取本地作用域
const evalResult = eval('localVar = "eval";globalVar="eval";global.b = 1;');
console.log('evalResult:', evalResult);
console.log('localVar:', localVar);
console.log('globalVar:', globalVar);
console.log('global.b:', global.b);
// evalResult: 1', localVar: 'eval', globalVar: 'eval', global.b: 1
// endregion
