import b from './b.mjs';

console.log('a 开始');
console.log('在 a 中，b.run', b.run()); // b 存在
console.log('a 结束');

export default {
  run() {
    console.log('a run');
  }
};

function aFn() {
  return 'afn return';
}

export { aFn };
