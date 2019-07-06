# 待验证
- subprocess.stderr 如果子进程被衍生时 stdio[2] 被设置为 'pipe' 以外的任何值，则该值将会是 null。

# 已验证
- fork,exec,execFile 都是由spawn实现的，而spawn是由POSIX里面的fork实现的

# note

child_process.exec(command[, options][, callback]) 启用shell执行命令

child_process.execFile(file[, args][, options][, callback]) 启用子进程执行可执行文件，默认不衍生shell

child_process.fork(modulePath[, args][, options]) spawn特例，专门用于衍生新的 Node.js 进程，返回的 ChildProcess 将会内置IPC通道

当子进程中有子进程时，kill函数会失效。
