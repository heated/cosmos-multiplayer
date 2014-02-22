(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Bubble = Cosmos.Bubble = function(radius, pos, vel) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
  }

  _(Bubble.prototype).extend({
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
    },

    grow: function(amount) {
      this.radius += amount;
    },

    collidesWith: function(bubble) {
      var dx = Math.abs(this.pos[0] - bubble.pos[0]);
      var dy = Math.abs(this.pos[1] - bubble.pos[1]);
      var dr = this.radius + bubble.radius;
      return (dx * dx + dy * dy) < (dr * dr);
    }
  });

  _(Bubble).extend({
    random: function() {
      var radius = Math.random() * 20 + 5;

      return new Bubble(radius, 
                        [Math.random() * (800 - 2 * radius) + radius, 
                         Math.random() * (500 - 2 * radius) + radius], 
                        [0, 0]);
    }
  });
})(this);
