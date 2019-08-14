const http = require('http');
const fs = require('fs');
const CLIENT_PORT = 3002;

// region client fetch
function fetchFunction() {
  const img = document.createElement('img');
  img.src = 'https://images.google.com/xxx';
  console.log('executed');
}
// endregion

// region client
http
  .createServer(function(req, res) {
    console.log('receive', req.url);
    switch (req.url) {
      case '/':
        const html = fs.readFileSync('./index.html', 'utf8');
        res.writeHead(200, {
          'Content-Type': 'text/html',
          // 有多少个 错误，就会 report 多少次
          'Content-Security-Policy-Report-Only': `default-src 'self'; report-uri ./report`,
        });
        res.end(html.replace('PLACE_HOLDER', fetchFunction.toString()));
        break;
      case '/script.js':
        res.end('console.log("link script executed")');
        break;
      case '/report':
        res.end();
        break;
    }
  })
  .listen(CLIENT_PORT, () => {
    console.log(`opened html server http://localhost:${CLIENT_PORT}`);
  });
// endregion
