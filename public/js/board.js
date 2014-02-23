(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Board = Cosmos.Board = function (game, ctx, options) {
    this.ctx = ctx;
    this.bubbles = [];
    this.options = options;
  }

  _(Board.prototype).extend({
    
    add: function (bubble) {
      this.bubbles.push(bubble);
    },
    
    data: function () {
      return this.bubbles.map(function (bubble) {
        return bubble.data();
      });
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
    
    initializeBubbles: function () {
      var board = this;
      if (!this.options || !this.options.bubbles) {
        this.makeBubbles(100);
      } else {
        var bubbles = this.options.bubbles.map(function (bubbleData) {
          var newBubble = Cosmos.Bubble.fromData(bubbleData, board);
          return newBubble;
        });
        this.bubbles = this.bubbles.concat(bubbles);
      }
    },
    
    makeBubbles: function (num) {
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
        20,
        [800/2, 500/2],
        [0,0],
        this,
        "blue"
      );
      this.bubbles.push(playerBubble);
      return playerBubble;
    },

    render: function () {
      this.ctx.clearRect(0, 0, 800, 500);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, 800, 500);
      
      var that = this;
      this.bubbles.forEach(function(bubble) {
        bubble.render(that.ctx);
      });
    },
    
    totalMass: function () {
      var total = 0;
      this.bubbles.forEach(function (bubble) {
        total += bubble.mass();
      });
      
      return total;
    },

    update: function () {
      this.bubbles.forEach(function(bubble) {
        bubble.move();
      });
      
      this.handleCollidingBubbles();
    },

  });
})(this);
