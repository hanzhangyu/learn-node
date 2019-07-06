import a, {aFn} from './a.mjs';

console.log('b 开始');
console.log('在 b 中，aFn', aFn()); // function 提升
console.log('在 b 中，a.run', a.run()); // a === undefined ES未运行完的模块被引用时，整个模块返回undefined
console.log('b 结束');

export default {
  run() {
    console.log('b run');
  }
};
