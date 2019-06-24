const ctx = self; // DedicatedWorkerGlobalScope
ctx.addEventListener('message', async e => {
  const intView = new Int8Array(e.data, 0);
  intView.reverse();
  console.log('reverse data:', intView);
  ctx.postMessage(e.data, [e.data]); // e.data将被锁住
});
