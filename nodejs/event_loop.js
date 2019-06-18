// region 四个定时器的顺序
// setTimeout(() => console.log(1));
// setImmediate(() => console.log(2));
// process.nextTick(() => console.log(3));
// Promise.resolve().then(() => console.log(4));
// (() => console.log(5))();
// endregion

// region setTimeout与setImmediate的不确定性
// setImmediate(() => {
//   setTimeout(() => console.log(1));
//   setImmediate(() => console.log(2));
// });
// endregion

// region node11.0.0之前setImmediate会同步的插入到当前循环的 immediate 队列中，而只有清空这个队列才会继续（process.nextTick能改变当前事件循环）。node11.0.0之后会在该阶段之后被插入队列。
// setImmediate(function(){
//   console.log(1);
//   process.nextTick(function(){
//     console.log(2);
//   });
// });
// process.nextTick(function(){
//   console.log(3);
//   setImmediate(function(){
//     console.log(4);
//   })
// });
// endregion

// region setTimeout 与 setImmediate 成本比较
// region setTimeout
// var i = 0;
// var start = new Date();
// function foo () {
//   i++;
//   if (i < 1000) {
//     setTimeout(foo, 0);
//   } else {
//     var end = new Date();
//     console.log("Execution time: ", (end - start));
//   }
// }
// foo();
// endregion

// region setImmediate
// var i = 0;
// var start = new Date();
// function foo () {
//   i++;
//   if (i < 1000) {
//     setImmediate(foo);
//   } else {
//     var end = new Date();
//     console.log("Execution time: ", (end - start));
//   }
// }
// foo();
// endregion
// endregion

// region 每次异步回调都会触发的nextTick
var i = 0;

function foo() {
  i++;
  if (i > 20) {
    return;
  }
  console.log('foo', i);
  setTimeout(() => {
    console.log('setTimeout', i);
  }, 0);
  process.nextTick(foo);
}

setTimeout(foo, 2);
setTimeout(() => {
  console.log('Other setTimeout');
}, 2);
// endregion
