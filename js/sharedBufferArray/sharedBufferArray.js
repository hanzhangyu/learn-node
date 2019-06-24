// 主线程
const worker = new Worker('./sharedBufferArray.worker.js');
const worker1 = new Worker('./sharedBufferArray.worker.js');
const length = 10;
const size = Int32Array.BYTES_PER_ELEMENT * length;
// 新建一段共享内存
const sharedBuffer = new SharedArrayBuffer(size);
const sharedArray = new Int32Array(sharedBuffer);
for (let i = 0; i < 10; i++) {
  // 向共享内存写入 10 个整数
  Atomics.store(sharedArray, i, i);
}
worker.postMessage({ id: 0, buf: sharedBuffer });
worker1.postMessage({ id: 1, buf: sharedBuffer });
setTimeout(() => {
  // 唤醒index为0处正在wait的count个worker线程
  Atomics.wake(sharedArray, 0, 1);
}, 3000);
