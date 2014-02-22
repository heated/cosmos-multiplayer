(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Game = Cosmos.Game = function() {
    var ctx = $('#canvas')[0].getContext("2d");
    this.board = new Cosmos.Board(ctx);
  }

  Game.INTERVAL = 1000 / 60;

  _(Game.prototype).extend({
    step: function() {
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