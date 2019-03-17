const http = require('http')
const querystring = require('querystring')
const fs = require('fs')
const path = require('path')
const multiparty = require('multiparty');

// Create an HTTP server
const srv = http
    .createServer((req, res) => {
        console.log(req.url, req.method);
        if (req.method === 'PUT') {
            let base64data = null;
            const form = new multiparty.Form();
            form.on('part', function (part) {
                if (part.filename === null) return part.resume();
                const buffers = [];
                part.on('data', function (chunk) {
                    buffers.push(chunk);
                });
                part.on('end', function () {
                    const buffer = Buffer.concat(buffers);
                    fs.writeFileSync(path.resolve(__dirname, part.filename), buffer);
                    const fileType = `/${part.filename.split('.')[1]}` || ''; // 可加可不加
                    base64data = `data:image${fileType};base64,${buffer.toString('base64')}`;
                    console.log(base64data);
                });
                // part.pipe(process.stdout);
            });

            form.on('close', function () {
                res.end(JSON.stringify({
                    image: base64data,
                }));
            });
            form.parse(req);
            return;
        }
        // 暂存请求体信息，非buffer数据使用拼接即可
        let body = '';
        req.on('data', function (chunk) {
            body += chunk;
        });
        // 在end事件触发后，通过querystring.parse将post解析为真正的POST请求格式。
        req.on('end', function () {
            body = querystring.parse(body);
            fs.createReadStream(path.resolve(__dirname, './index.tpl')).pipe(res);
        })
    })
    .listen(3000, '127.0.0.1', () => {
        console.log('opened server on', srv.address())
    })
