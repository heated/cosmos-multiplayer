(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Bubble = Cosmos.Bubble = function(radius, pos, vel) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
  }

  _(Bubble.prototype).extend({
    
    collidesWith: function(bubble) {
      var dx = Math.abs(this.pos[0] - bubble.pos[0]);
      var dy = Math.abs(this.pos[1] - bubble.pos[1]);
      var dr = this.radius + bubble.radius;
      return (dx * dx + dy * dy) < (dr * dr);
    },
    
    grow: function(amount) {
      this.radius += amount;
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
      ctx.fillStyle = "black";
      ctx.beginPath();

      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    },

    shrink: function(amount) {
      this.radius -= amount;
    }
  });

  _(Bubble).extend({
    random: function() {
      var radius = Math.random() * 20 + 5;
      var direction = Math.random() * Math.PI * 2;

      return new Bubble(radius, 
                        [Math.random() * (800 - 2 * radius) + radius, 
                         Math.random() * (500 - 2 * radius) + radius], 
                        [Math.cos(direction), 
                         Math.sin(direction)]);
    }
  });
})(this);
