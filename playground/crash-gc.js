/**
 * process.memoryUsage())
 * {
 *   rss: 171388928,  rss, 驻留集大小, 是给这个进程分配了多少物理内存(占总分配内存的一部分) 这些物理内存中包含堆(对象，字符串，闭包)，栈(变量)，和代码段(JavaScript源代码)。
 *   heapTotal: 70426624,  heapTotal 和 heapUsed 代表V8的内存使用情况
 *   heapUsed: 34427384,
 *   external: 82334272,  external代表V8管理的，绑定到Javascript的C++对象的内存使用情况
 * }
 */

// region 不断推入元素挤爆 V8 heap
// let arr = [];
// while (true) arr.push(1);
// endregion

// region 空的push只会占用cpu
// let arr = [];
// while (true) arr.push();
// endregion

// region Buffer内存分配不在 V8 的堆内存中，而是在 node 的c++ 层面实现的
let arr = [];
while (true) arr.push(new Buffer(1000));
// endregion
