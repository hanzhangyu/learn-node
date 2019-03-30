// worker.js
self.addEventListener(
  'message',
  event => {
    const { buf, id } = event.data;
    const sharedArray = new Int32Array(buf);
    const arrayIndex = 0;
    const expectedStoredValue = 0;
    console.time(`work ${id} wait`);
    // 如果index处等于expectedStoredValue则进入休眠
    Atomics.wait(sharedArray, arrayIndex, expectedStoredValue);
    console.timeEnd(`work ${id} wait`);
    console.log(Atomics.load(sharedArray, arrayIndex));
  },
  false
);
