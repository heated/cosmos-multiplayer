(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Game = Cosmos.Game = function(socket, options) {
    this.socket = socket;
    this.canvas = $('#canvas')[0];
    var ctx = this.canvas.getContext("2d");
    this.board = new Cosmos.Board(this, ctx, options);
    this.player = new Cosmos.Player(this.board);
    this.remotePlayers = [];
    this.totalMass = this.board.totalMass();
    this.over = false;
  }

  Game.INTERVAL = 1000 / 60;

  _(Game.prototype).extend({
    
    handleInput: function () {
      var game = this;
      
      var keyDirOpposites = {
        38: 3 * Math.PI / 2, // down
        40: Math.PI / 2, // up
        37: 0, // right
        39: Math.PI // left
      };
      
      var keys = key.getPressedKeyCodes().filter(function (keycode) {
        return [37, 38, 39, 40].indexOf(keycode) != -1;
      });
      
      keys.forEach(function (key) {
        game.player.bubble.expel(keyDirOpposites[key]);
      });
    },
    
    installSocketHandlers: function () {
      var game = this;
      
      game.socket.on("connect", function () {
        console.log("connected!");
      });
      
      game.socket.on("new-player", function (data) {
        game.remotePlayers.push(data);
        var newBubble = new Cosmos.Bubble(
          data.radius,
          data.pos,
          data.vel,
          game.board,
          data.color
        );
        game.board.add(newBubble);
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
      } else if (this.isLost()) {
        alert("You have been absorbed.");
        this.stop();
      }
    },

    start: function () {
      this.installSocketHandlers();
      this.interval = setInterval(this.step.bind(this), Game.INTERVAL);
    },
    
    stop: function () {
      clearInterval(this.interval);
    }
    
  });
})(this);

$(function () {
  Cosmos.socket = io.connect();
  var game = new Cosmos.Game(Cosmos.socket);
  game.start();
  var bubble = game.player.bubble;
  var data = {
    radius: bubble.radius,
    pos: bubble.pos,
    vel: bubble.vel,
    color: bubble.color
  };
  Cosmos.socket.emit("new-player", data);
  // Cosmos.socket.on("new-game", function (data) {
//     game = new Cosmos.Game(Cosmos.socket, data);
//     socket.emit("started-game", game);
//     game.start();
//   });

});