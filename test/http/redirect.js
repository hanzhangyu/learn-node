const http = require('http');
const CLIENT_PORT = 3002;

// region client
http
  .createServer(function(req, res) {
    console.log(req.url);
    switch (req.url) {
      case '/':
        res.writeHead(200, {
          'Content-Type': 'text/html',
        });
        res.end(`<div>main</div><script>
            fetch('./302', {method: 'delete'})
        </script>`);
        break;
      case '/302': // 定时重定向
        res.writeHead(302, {
          Location: '/',
        });
        res.end('ignored'); // 返回会被忽略
        break;
      case '/307': // 定时重定向，修正 POST 重定向后为 GET 的 BUG
        res.writeHead(307, {
          Location: '/',
        });
        res.end('ignored');
        break;
      case '/301': // 永久重定向，会被缓存，需要清理缓存
        res.writeHead(301, {
          Location: '/',
        });
        res.end('ignored');
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
