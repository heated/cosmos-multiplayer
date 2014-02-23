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
      socketServer.sockets.emit("keydown", data);
    });
    
    socket.on("new-player", function (data) {
      data.id = socket.id;
      socket.broadcast.emit("new-player", data);
      var reqData = {
        forId: socket.id
      };
      socket.broadcast.emit("request-update", reqData);
      players.push(data);
    });
    
    socket.on("player-update", function (data) {
      data.id = socket.id;
      playerSockets[data.forId].emit("new-player", data);
    });
    
    socket.on("receive-bubbles", function (data) {
      playerSockets[data.forId].emit("join-game", data);
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