const Socket = require('net').Socket;

// 均为net.Socket 流（也就是双工流）
console.log(process.stdin instanceof Socket); // 连接到 stdin (fd 0) 的流，除非 fd 0 指向一个文件，在这种情况下它是一个可读流。（不然还是可写的）
console.log(process.stdout instanceof Socket); // 连接到 stdout (fd 1) 的流，除非 fd 1 指向一个文件，在这种情况下它是一个可写流。
console.log(process.stderr instanceof Socket); // 连接到 stderr (fd 2) 的流，除非 fd 2 指向一个文件，在这种情况下它是一个可写流。

/**
 process.stdout and process.stderr 与 Node.js 中其他 streams 在重要的方面有不同:
 - console.log() 和 console.error() 内部分别是由它们实现的。
 - 他们不能被关闭 (调用[end()][]将会抛出异常)。
 - 他们永远不会触发 ['finish'][] 事件。
 - 写操作是否为同步，取决于连接的是什么流以及操作系统是 Windows 还是 POSIX :
     - Files: 同步 在 Windows 和 POSIX 下
     - TTYs (Terminals): 异步 在 Windows 下， 同步 在 POSIX 下
     - Pipes (and sockets): 同步 在 Windows 下， 异步 在 POSIX 下
 */
