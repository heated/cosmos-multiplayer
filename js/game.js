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
    
    installKeyHandlers: function () {
      var game = this;
      
      $(document).on("keydown", function (event) {
        var dir;
        switch (event.which) {
          case 38:
            dir = "up";
            break;
          case 40:
            dir = "down";
            break;
          case 37:
            dir = "left";
            break;
          case 39:
            dir = "right";
            break;
        }
        
        game.player.changeVel(dir);
      });
    },
    
    step: function() {
      this.board.update();
      this.board.render();
    },

    start: function() {
      this.installKeyHandlers();
      setInterval(this.step.bind(this), Game.INTERVAL);
    }
  });
})(this);

$(function() {
  game = new Cosmos.Game();
  game.start();
});