const { fork } = require('child_process');

// region view
console.log('process.env.isChild', process.env.isChild);
const name = process.env.isChild ? 'child' : 'parent';
setInterval(() => {
  console.log(name, ' alive');
}, 1000);
// endregion

// region fork from parent then exit parent
if (!process.env.isChild) {
  fork('./orphan.js', {
    detached: true,
    env: { isChild: true }
  });

  // kill parent
  setTimeout(() => {
    process.exit(0); // 为杀死之前为子进程，之后为孤儿进程
  }, 10000);
}
// endregion
