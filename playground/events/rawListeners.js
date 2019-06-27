const EventEmitter = require('events');
const emitter = new EventEmitter();

// region once in rawListeners
emitter.once('log', () => console.log('只记录一次  ')); // once绑定的会被封装议程
const listeners = emitter.rawListeners('log'); // [bound onceWrapper function]
const logFnWrapper = listeners[0];
logFnWrapper.listener(); // 打印 “只记录一次”，但不会解绑 `once` 事件。
logFnWrapper(); // 打印 “只记录一次”，且移除监听器。
// endregion

// region on in rawListeners
emitter.on('log', () => console.log('持续地记录'));
const newListeners = emitter.rawListeners('log'); // [on callback]
// 打印两次 “持续地记录”
newListeners[0]();
emitter.emit('log');
// endregion
