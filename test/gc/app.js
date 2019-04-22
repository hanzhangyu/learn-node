const { EventEmitter } = require('events');
const heapdump = require('heapdump');
global.test = new EventEmitter();
heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');

function run3() {
  const innerData = new Buffer(10000);
  const outClosure3 = function() {
    void innerData;
  };
  outClosure3();
  test.on('error', () => {
    console.log('error');
  });
}
for (let i = 0; i < 10; i++) {
  run3();
}
gc();
heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
