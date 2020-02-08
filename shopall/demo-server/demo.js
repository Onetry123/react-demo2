let http = require('http')
let url = require('url')
let util = require('util')
let fs=require('fs')
http.createServer((req, res) => {
  // res.statusCode = 200;
  // res.setHeader('Contont-Type', 'text/plain; Charset=utf-8');
  let pathname= url.parse(req.url).pathname
  fs.readFile(pathname.substring(1), (err, data) => {
    if (!err) {
      res.writeHead(200, {
        "Contont-Type":'text/html'
      })
      res.write(data.toString())
    } else {
      res.writeHead(404, {
        "Contont-Type": 'text/html'
      })
    }
    res.end();
  })
}).listen(3000, '127.0.0.1', () => {
  console.log('服务器已运行，请打开浏览器输入：http://localhost:3000打开页面')
})

