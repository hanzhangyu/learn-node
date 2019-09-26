function a() {
  setTimeout(() => {
    throw new Error('123');
  }, 100);
}

a(); // 浏览器中没有（只有在断点调试时，调用栈信息才包含函数a，对于async代码会画一条线作区分），nodejs中没有（栈底Timer.processTimers），csharp中也一样（栈底System.Threading.Tasks.Task.Execute()）
