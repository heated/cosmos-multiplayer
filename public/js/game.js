(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Game = Cosmos.Game = function(socket, options) {
    this.socket = socket;
    this.canvas = $('#canvas')[0];
    var ctx = this.canvas.getContext("2d");
    this.board = new Cosmos.Board(this, ctx, options);
    this.player = new Cosmos.Player(this.board);
    this.board.initializeBubbles();
    this.remotePlayers = [];
    this.totalMass = this.board.totalMass();
    this.over = false;
  }

  Game.INTERVAL = 1000 / 60;

  _(Game.prototype).extend({
    
    handleInput: function () {
      var game = this;
      
      var keyDirs = {
        38: Math.PI / 2, // up
        40: 3 * Math.PI / 2, // down
        37: Math.PI, // left
        39: 0 // right
      };
      
      var keys = key.getPressedKeyCodes().filter(function (keycode) {
        return [37, 38, 39, 40].indexOf(keycode) != -1;
      });
      
      keys.forEach(function (key) {
        game.player.bubble.expel(keyDirs[key]);
        var data = {
          key: key
        };
        game.socket.emit("keydown", data);
      });
    },
    
    installSocketHandlers: function () {
      var game = this;
      
      var playerById = function (id) {
        for (var i in game.remotePlayers) {
          if (game.remotePlayers[i].id == id) {
            return i;
          } 
        }
      };
      
      game.socket.on("connect", function () {
        console.log("connected!");
      });
      
      game.socket.on("keydown", function (data) {
        var playerIdx = playerById(data.id);
        if (playerIdx != -1) {
          var player = game.remotePlayers[playerIdx];
              
          var keyDirs = {
            38: Math.PI / 2, // up
            40: 3 * Math.PI / 2, // down
            37: Math.PI, // left
            39: 0 // right
          };
        
          player.bubble.expel(keyDirs[data.key]);
        }
      });
      
      game.socket.on("new-player", function (data) {
        console.log("look a new player!");
        var newBubble = Cosmos.Bubble.fromData(data.bubble, game.board);
        game.board.add(newBubble);
        var player = {
          id: data.id,
          bubble: newBubble
        };
        game.remotePlayers.push(player);
        console.log(game.remotePlayers);
      });
      
      game.socket.on("remove-player", function (data) {
        var playerIdx = playerById(data.id);
        var player = game.remotePlayers[playerIdx];
        game.board.delete(player.bubble);
        game.remotePlayers.splice(playerIdx, 1);
      });
      
      game.socket.on("request-bubbles", function (data) {
        var bubblesCopy = game.board.bubbles.slice(0);
        var playerIdx = bubblesCopy.indexOf(game.player.bubble);
        if (playerIdx != -1) {
          bubblesCopy.splice(playerIdx, 1);
        }
        var bubbles = bubblesCopy.map(function (bubble) {
          return bubble.data();
        });
                
        var responseData = {
          forId: data.forId,
          bubbles: bubbles
        };
        game.socket.emit("receive-bubbles", responseData);
      });
      
      game.socket.on("request-update", function (data) {
        var responseData = {
          forId: data.forId,
          bubble: game.player.bubble.data()
        };
        
        game.socket.emit("player-update", responseData);
      });
    },
    
    isLost: function () {
      return this.board.bubbles.indexOf(this.player.bubble) == -1;
    },
    
    isWon: function () {
      return this.player.bubble.mass() * 2 > this.totalMass;
    },
        
    step: function () {
      this.handleInput();
      this.board.update();
      this.board.render();
      if (!this.over && this.isWon()) {
        alert("Domination.");
        this.over = true;
      } else if (!this.over && this.isLost()) {
        alert("You have been absorbed.");
        this.over = true;
      }
    },

    start: function () {
      this.installSocketHandlers();
      var bubbleData = this.player.bubble.data();
      var data = {
        bubble: bubbleData
      };
      Cosmos.socket.emit("new-player", data);
      this.interval = setInterval(this.step.bind(this), Game.INTERVAL);
    },
    
    stop: function () {
      clearInterval(this.interval);
    }
    
  });
})(this);

$(function () {
  Cosmos.socket = io.connect();
  
  Cosmos.socket.on("new-game", function () {
    console.log("new game!");
    window.game = new Cosmos.Game(Cosmos.socket);
    window.game.start();
  });
  
  Cosmos.socket.on("join-game", function (data) {
    console.log("joining game!");
    window.game = new Cosmos.Game(Cosmos.socket, data);
    window.game.start();
  });

});