/**
 * 测试 打开 telnet 127.0.0.1 3000
 * @type {module:net}
 */
const net = require('net');

let server = net.createServer((socket) => {
    console.log('client connected', socket.address());
    socket.on('end', () => {
      console.log('client: disconnected');
    });
    socket.on('close', () => {
      console.log('client: close');
    });
    socket.on('data', (data) => {
      console.log('client: send msg', data.toString());
    });
    socket.write('hello\r\n');
    // sock.pipe(sock); // readable.pipe(writable);
});

server.on('close', function(){
    console.log( '服务端: 关闭');
});
server.on('connection', function(socket){
    console.log( '服务端: 收到新的connection', socket.address());
});
server.on('error', function(error){
    console.log( '服务端: 异常' + error.message );
});
server.on('listening', function(){
    console.log( '服务端: listening');
});
server.listen(3000, '0.0.0.0', () => {
    console.log('opened server on', server.address());
});

// setTimeout(() => {
//     console.warn('自动关闭');
//     server.close();
// }, 10000);
