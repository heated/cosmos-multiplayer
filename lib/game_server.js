var GameServer = {};

module.exports = GameServer;

var socketIO = GameServer.socketIO = require("socket.io");

GameServer.start = function (server) {
  console.log("Creating game...");
  var socketServer = socketIO.listen(server);
  
  var players = [];
  var playerSockets = {};
  
  socketServer.on("connection", function (socket) {
    
    playerSockets[socket.id] = socket;
    
    if (players.length == 0) {
      socket.emit("new-game");
    } else {
      var data = {
        forId: socket.id
      };
      playerSockets[players[0].id].emit("request-bubbles", data);
    }
    
    socket.on("keydown", function (data) {
      data.id = socket.id;
      socket.broadcast.emit("keydown", data);
    });
    
    socket.on("new-player", function (data) {
      data.id = socket.id;
      socket.broadcast.emit("new-player", data);
      // console.log(players);
      players.forEach(function (player) {
        socket.emit("new-player", player)
      });
      players.push(data);
    });
    
    socket.on("receive-bubbles", function (data) {
      playerSockets[data.forId].emit("join-game", data);
    });
    
    socket.on("update-player", function (data) {
      var playerIdx = playerById(socket.id);
      players[playerIdx].bubble = data.bubble;
    });
        
    socket.on("disconnect", function () {
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