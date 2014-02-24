var http = require("http");
var static = require("node-static");
var io = require("socket.io");

var gameServer = require("./lib/game_server.js");

var fileServer = new static.Server("./public");

var server = http.createServer(function (request, response) {
  request.addListener("end", function () {
      fileServer.serve(request, response, function (error, res) {
        if (error && (error.status === 404)) {
          fileServer.serveFile("/404.html", 404, {}, request, response);
        }
      });
    }).resume();
});

var port = Number(process.env.PORT || 5000);
gameServer.start(server);
server.listen(port);
// console.log("Server running at http://127.0.0.1:8080/...");