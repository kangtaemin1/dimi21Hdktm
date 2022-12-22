var http = require('http');
var url = require('url');
var qs = require('querystring');
const mysql = require('mysql');
var fs = require('fs');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kangtaemin12345@",
    database: "mydb"
})

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    if (pathname === '/') {
        fs.readFile('./test.html', function(err, html){
            response.writeHead(200);
            response.end(test.html);
        })
    } else if (pathname === '/post_test') {
      var body = '';
      request.on('data', function (data) {
        body = body + data;
      });
      request.on('end', function () {
        var post = qs.parse(body);
        console.log(post);
        var title = post.title;
        var description = post.description;
        response.end(`
            <!doctype html>
            <html>
            <head>
              <title>POST</title>
              <meta charset="utf-8">
            </head>
            <body>
              <p>title : ${title}</p>
              <p>description : ${description}</p>
            </body>
            </html>
            `);
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
  });
  app.listen(3000);