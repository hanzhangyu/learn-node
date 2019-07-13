# 待验证
- subprocess.stderr 如果子进程被衍生时 stdio[2] 被设置为 'pipe' 以外的任何值，则该值将会是 null。

# 已验证
- fork,exec,execFile 都是由spawn实现的，而spawn是由POSIX里面的fork实现的

# note

child_process.exec(command[, options][, callback]) 启用shell执行命令

child_process.execFile(file[, args][, options][, callback]) 启用子进程执行可执行文件，默认不衍生shell

child_process.fork(modulePath[, args][, options]) spawn特例，专门用于衍生新的 Node.js 进程，返回的 ChildProcess 将会内置IPC通道

当子进程中有子进程时，kill函数会失效。

- spawn() 启动一个子进程来执行命令
- options.detached 父进程死后是否允许子进程存活
- options.stdio 指定子进程的三个标准流
- spawnSync() 同步版的 spawn, 可指定超时, 返回的对象可获得子进程的情况
- exec() 启动一个子进程来执行命令, 带回调参数获知子进程的情况, 可指定进程运行的超时时间
- execSync() 同步版的 exec(), 可指定超时, 返回子进程的输出 (stdout)
- execFile() 启动一个子进程来执行一个可执行文件, 可指定进程运行的超时时间
- execFileSync() 同步版的 execFile(), 返回子进程的输出, 如何超时或者 exit code 不为 0, 会直接 throw Error
- fork() 加强版的 spawn(), 返回值是 ChildProcess 对象可以与子进程交互
