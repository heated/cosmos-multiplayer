(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Game = Cosmos.Game = function() {
    this.canvas = $('#canvas')[0];
    var ctx = this.canvas.getContext("2d");
    this.board = new Cosmos.Board(ctx);
    this.player = this.board.makePlayerBubble();
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
        game.player.expel(keyDirOpposites[key]);
      });
    },
    
    step: function() {
      this.handleInput();
      this.board.update();
      this.board.render();
    },

    start: function() {
      setInterval(this.step.bind(this), Game.INTERVAL);
    }
  });
})(this);

$(function() {
  game = new Cosmos.Game();
  game.start();
});