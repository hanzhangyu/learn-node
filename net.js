let server = require('net').createServer((sock) => {
    console.log('client connected');
    c.on('end', () => {
      console.log('client disconnected');
    });
    c.write('hello\r\n');
    c.pipe(c);
});

// grab an arbitrary unused port.
server.listen(3000, () => {
    console.log('opened server on', server.address());
});
server.on('close', function(){
    console.log( 'close事件：服务端关闭' );
});

server.on('error', function(error){
    console.log( 'error事件：服务端异常：' + error.message );
});