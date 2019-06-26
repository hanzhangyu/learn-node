const vm = require('vm');

function loop() {
  while (1) console.log(Date.now());
}

// region vm内嵌microtask and nextTick queues
vm.runInNewContext(
  'Promise.resolve().then(loop);', // 所有的上下文使用同一个 microtask and nextTick queues
  { loop },
  { timeout: 5 } // 这里的timeout是对于同步代码的
);
// endregion

// region 其余 timer 或者 setImmediate 则不存在
try {
  vm.runInNewContext('setTimeout'); // setTimeout在global，所以不存在
} catch (e) {
  console.error(e);
}
// endregion
