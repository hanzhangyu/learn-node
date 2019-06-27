const EventEmitter = require('events');

const myEmitter = new EventEmitter();
myEmitter.on('event', function() {
  console.log('触发事件', this === myEmitter); // 早于end
});
myEmitter.emit('event');

console.log('end');
