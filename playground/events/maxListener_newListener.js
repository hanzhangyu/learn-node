const EventEmitter = require('events');
const emitter = new EventEmitter();

// region MaxListeners
console.log(
  'MaxListeners',
  emitter.getMaxListeners(),
  EventEmitter.defaultMaxListeners
);
emitter.setMaxListeners(3);
console.log('MaxListeners', emitter.getMaxListeners());
// endregion

// region 先触发newListener事件，然后插入正在添加的listener
emitter.on('newListener', function a(event, listener) {
  console.log('newListener on', event, listener === b); // 'newListener' true，不会触发自己，因为先触发newListener事件，然后插入listener
});
emitter.on('event', () => {
  console.log('A');
});
// 只处理一次，避免无限循环。
emitter.once('newListener', b);
function b(event, listener) {
  console.log('newListener once', event);
  if (event === 'event') {
    // 在该事件前面插入一个新的监听器数组。因为先触发newListener事件，然后插入listener
    emitter
      .on('event', () => {
        console.log('B1');
      })
      .on('event', () => {
        console.log('B2');
      })
      .on('event', () => {
        console.log('B3');
      });
  }
}
emitter.on('event', () => {
  console.log('C');
});
// endregion

emitter.emit('event');
