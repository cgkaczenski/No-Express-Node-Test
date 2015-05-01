var router = require("./router.js");
var http = require('http');
var port = process.env.PORT || 8080;

http.createServer(function (request, response) {
  router.home(request, response);
  router.stock(request, response);
}).listen(port, function () {
    console.log('Server running at ' + port);
});
