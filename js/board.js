(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Board = Cosmos.Board = function(ctx) {
    this.ctx = ctx;
    this.bubbles = [];
    this.makeBubbles(50);
  }

  _(Board.prototype).extend({
    makeBubbles: function(num) {
      var bubbles = this.bubbles;
      while(bubbles.length < num) {
        var newBubble = Cosmos.Bubble.random();
        
        var collides = bubbles.some(function(bubble) {
          return newBubble.collidesWith(bubble);
        })

        if(!collides) {
          bubbles.push(newBubble);
        }
      }
    },

    render: function() {
      this.ctx.clearRect(0, 0, 800, 500);
      var that = this;
      this.bubbles.forEach(function(bubble) {
        bubble.render(that.ctx);
      });
    },

    update: function() {
      this.bubbles.forEach(function(bubble) {
        bubble.move();
      });
    }
  });
})(this);
