var GameServer = {};

module.exports = GameServer;

var socketIO = GameServer.socketIO = require("socket.io");

GameServer.start = function (server) {
  console.log("Creating game...");
  var socketServer = socketIO.listen(server);
  
  var players = [];
  
  socketServer.on("connection", function (socket) {
    // var message, data;
    
    // if (numPlayers == 0) {
    //   message = "new-game";
    // } else {
    //   message = "join-game";
    //   data = this.game;
    // }
    // socketServer.sockets.emit(message, data);
    
    socket.on("new-player", function (data) {
      data.id = socket.id;
      socket.broadcast.emit("new-player", data);
      players.forEach(function (player) {
        socket.emit("new-player", player);
      });
      players.push(data);
    });
        
    socket.on("disconnect", function () {
      // remove player
      var playerIdx = playerById(socket.id);
      players.splice(playerIdx, 1);
      var data = { id: socket.id };
      socket.broadcast.emit("remove-player", data);
    });
  });
  
  var playerById = function (id) {
    for (var i in players) {
      if (players[i].id == id) {
        return i;
      } 
    }
  };
};