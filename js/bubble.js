(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Bubble = Cosmos.Bubble = function(radius, pos, vel, board, color) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
    this.board = board;
    this.color = color || "black";
  }

  _(Bubble.prototype).extend({
    
    absorb: function (bubble) {
      var bigR = this.radius;
      var smallR = bubble.radius;
      var dSq = this.distanceSq(bubble);
      var d = Math.sqrt(dSq);
      var newBigR = bigR;
      var newSmallR = smallR;
      
      // handle case where one bubble completely absorbs another
      var sq = function (n) { return n * n };
      var totalMass = sq(bigR) + sq(smallR);
      var totallyAbsorbed = (totalMass >= dSq);
      if (totallyAbsorbed) {
        this.radius = Math.sqrt(totalMass);
        this.board.delete(bubble);
        return;
      }

      // find new radii such that mass is conserved and bubbles are still
      // touching
      var absorbed = false;
      while (!absorbed) {
        newBigR += 0.01;
        newSmallR = d - newBigR;
        absorbed = (Math.abs((newBigR * newSmallR) -
                        ((dSq - (bigR * bigR) - (smallR * smallR)) / 2)) < 10);
      }
      
      this.radius = newBigR;
      bubble.radius = newSmallR;
    },
    
    changeVel: function (dir) {
      var deltas = {
        up: [0, -0.2],
        down: [0, 0.2],
        left: [-0.2, 0],
        right: [0.2, 0]
      };
      
      this.vel[0] += deltas[dir][0];
      this.vel[1] += deltas[dir][1];
    },
    
    collidesWith: function(bubble) {
      var dr = this.radius + bubble.radius;
      return this.distanceSq(bubble) < (dr * dr);
    },
        
    distanceSq: function (bubble) {
      var dx = Math.abs(this.pos[0] - bubble.pos[0]);
      var dy = Math.abs(this.pos[1] - bubble.pos[1]);
      return (dx * dx + dy * dy);
    },
    
    grow: function(amount) {
      this.radius += amount;
    },
    
    handleCollision: function (bubble) {
      if (this.radius > bubble.radius) {
        this.absorb(bubble);
      }
    },
    
    handleWalls: function () {
      var x = this.pos[0];
      if (x + this.radius > 800 || x - this.radius < 0) {
        this.vel[0] = -this.vel[0];
      }
      
      var y = this.pos[1];
      if (y + this.radius > 500 || y - this.radius < 0) {
        this.vel[1] = -this.vel[1];
      }
    },
    
    mass: function() {
      return Math.pow(this.radius, 2);
    },
    
    move: function() {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.handleWalls();
    },
    
    render: function(ctx) {
      // ctx.fillStyle = "black";
      ctx.beginPath();

      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = this.color;
      ctx.stroke();
    },

    shrink: function(amount) {
      this.radius -= amount;
    }
    
    
  });

  _(Bubble).extend({
    random: function(board) {
      var radius = Math.random() * 20 + 5;
      var direction = Math.random() * Math.PI * 2;

      return new Bubble(radius, 
                        [Math.random() * (800 - 2 * radius) + radius, 
                         Math.random() * (500 - 2 * radius) + radius], 
                        [Math.cos(direction) * 0.1, 
                         Math.sin(direction) * 0.1],
                         board);
    }
  });
})(this);
