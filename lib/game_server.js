var GameServer = {};

module.exports = GameServer;

var socketIO = GameServer.socketIO = require("socket.io");

GameServer.start = function (server) {
  console.log("Creating game...");
  var socketServer = socketIO.listen(server);
  
  socketServer.on("connection", function (socket) {
    
    socket.emit("new-player");
    
    socket.on("disconnect", function () {
      // remove player
    });
  });
};