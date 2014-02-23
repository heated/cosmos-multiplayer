(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Board = Cosmos.Board = function(ctx) {
    this.ctx = ctx;
    this.bubbles = [];
    this.makeBubbles(200);
  }

  _(Board.prototype).extend({
    
    add: function (bubble) {
      this.bubbles.push(bubble);
    },
    
    delete: function (bubble) {
      var bubbleIdx = this.bubbles.indexOf(bubble);
      if (bubbleIdx != -1) {
        this.bubbles.splice(bubbleIdx, 1);
      }
    },
    
    handleCollidingBubbles: function () {
      var board = this;
      
      board.bubbles.forEach(function (bubble) {
        board.bubbles.forEach(function (otherBubble) {
          if (bubble == otherBubble) {
            return;
          } else if (bubble.collidesWith(otherBubble)) {
            bubble.handleCollision(otherBubble);
          }
        })
      });
    },
    
    makeBubbles: function(num) {
      var bubbles = this.bubbles;
      while(bubbles.length < num) {
        var newBubble = Cosmos.Bubble.random(this);
        
        var collides = bubbles.some(function(bubble) {
          return newBubble.collidesWith(bubble);
        })

        if(!collides) {
          bubbles.push(newBubble);
        }
      }
    },
    
    makePlayerBubble: function () {
      var playerBubble = new Cosmos.Bubble(
        40,
        [800/2, 500/2],
        [0,0],
        this,
        "blue"
      );
      this.bubbles.push(playerBubble);
      return playerBubble;
    },

    render: function() {
      this.ctx.clearRect(0, 0, 800, 500);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, 800, 500);
      
      var that = this;
      this.bubbles.forEach(function(bubble) {
        bubble.render(that.ctx);
      });
    },

    update: function() {
      this.bubbles.forEach(function(bubble) {
        bubble.move();
      });
      
      this.handleCollidingBubbles();
    }
  });
})(this);
