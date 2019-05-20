/**
 * @usage
 *  1. node --prof gc.js
 *  2. node --prof-process isolate-xxx-v8.log
 */
// for (var i = 0; i < 1000000; i++) {
//     var a = {};
// }

/**
 * @desc 内存超过限制V8会崩掉
 * @usage
 *  1. node gc.js
 */
// var showMem = function () {
//     var mem = process.memoryUsage();
//     var format = function (bytes) {
//         return (bytes / 1024 / 1024).toFixed(2) + ' MB';
//     };
//     console.log('Process: heapTotal ' + format(mem.heapTotal) +
//         ' heapUsed ' + format(mem.heapUsed) + ' rss ' + format(mem.rss));
//     console.log('-----------------------------------------------------------');
// };
// var useMem = function () {
//     var size = 20 * 1024 * 1024;
//     var arr = new Array(size);
//     for (var i = 0; i < size; i++) {
//         arr[i] = 0;
//     }
//     return arr;
// };
// var total = [];
// for (var j = 0; j < 15; j++) {
//     showMem();
//     total.push(useMem());
// }
// showMem();
