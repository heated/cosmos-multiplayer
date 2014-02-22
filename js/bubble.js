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

      ctx.fill();
    },

    shrink: function(amount) {
      this.radius -= amount;
    },

    grow: function(amount) {
      this.radius += amount;
    }
  });

  _(Bubble).extend({
    random: function() {
      return new Bubble(10, 
                        [100 + Math.random() * 100, 
                         100 + Math.random() * 100], 
                        [0, 0]);
    }
  });
})(this);

$(function() {
  window.bubble = Cosmos.Bubble.random()
  // console.log($('#canvas'))
  window.bubble.render($('#canvas')[0].getContext("2d"));
});