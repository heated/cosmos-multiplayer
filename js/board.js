(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Board = Cosmos.Board = function(ctx) {
    this.ctx = ctx;
    this.bubbles = [];
    this.makeBubbles(50);
  }

  _(Board.prototype).extend({
    makeBubbles: function(num) {
      for(var i = 0; i < num; i++) {
        this.bubbles.push(Cosmos.Bubble.random());
      }
    },

    render: function() {
      var that = this;
      this.bubbles.forEach(function(bubble) {
        bubble.render(that.ctx);
      });
    },

    update: function() {

    }
  });
})(this);
