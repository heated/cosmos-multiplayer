(function(root) {
  var Cosmos = root.Cosmos = (root.Cosmos || {});

  var Bubble = Cosmos.Bubble = function(radius, pos, vel, board, color) {
    this.radius = radius;
    this.pos = pos;
    this.vel = vel;
    this.board = board;
    this.color = color || "white";
  }

  _(Bubble.prototype).extend({
    
    absorb: function (bubble) {
      var dSq = this.distanceSq(bubble);
      var initialMass = this.mass();
      var totalMass = this.mass() + bubble.mass();
      var bigMomentum = this.momentum();
      var smallMomentum, newMass;
      
      // completely absorbed
      if (totalMass >= dSq) {
        this.radius = Math.sqrt(totalMass);
        this.board.delete(bubble);
        newMass = this.mass();
        smallMomentum = bubble.momentum();
      } else {
        var d = Math.sqrt(dSq);

        // solve for new radius such that total area is conserved
        // and bubbles are still touching
        // wolfram alpha solution to the quadratic: "solve for x in x^2 + (d-x)^2 = r^2 + R^2"
        var quadratic = (d + Math.sqrt( 2 * totalMass - d * d )) / 2;

        this.radius = quadratic;
        bubble.radius = d - this.radius;
        
        newMass = this.mass();
        var massDiff = newMass - initialMass;
        smallMomentum = bubble.vel.map(function (dir) {
          return dir * massDiff;
        });
      }
      
      var newMomentum = [bigMomentum[0] + smallMomentum[0],
                         bigMomentum[1] + smallMomentum[1]];
      this.vel = newMomentum.map(function (dir) {
        return dir / newMass;
      });
    },
    
    collidesWith: function (bubble) {
      var dr = this.radius + bubble.radius;
      return this.distanceSq(bubble) < (dr * dr);
    },
    
    dimSnap: function (max, pos) {
      return this.rangeSnap(this.radius, (max - this.radius), pos);
    },
        
    distanceSq: function (bubble) {
      var dx = Math.abs(this.pos[0] - bubble.pos[0]);
      var dy = Math.abs(this.pos[1] - bubble.pos[1]);
      return (dx * dx + dy * dy);
    },

    distance: function (bubble) {
      return Math.sqrt(this.distanceSq(bubble));
    },
    
    expel: function (dir) {
      var radius = this.radius / 10;
      
      var unitDir = [Math.cos(dir), -Math.sin(dir)];
      var x = this.pos[0];
      var y = this.pos[1];
      var distance = this.radius + radius;
      var pos = [x + unitDir[0] * distance, y + unitDir[1] * distance];
      
      var velX = this.vel[0];
      var velY = this.vel[1];
      var vel = [velX + (unitDir[0] * 2), velY + (unitDir[1] * 2)];
      
      var expelled = new Bubble(radius, pos, vel, this.board);
      this.board.add(expelled);

      var momentum = this.momentum();
      var expelledMomentum = expelled.momentum();
      this.radius = Math.sqrt(this.mass() - expelled.mass());
      this.vel[0] = (momentum[0] - expelledMomentum[0]) / this.mass();
      this.vel[1] = (momentum[1] - expelledMomentum[1]) / this.mass();
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
      
      this.pos[0] = this.dimSnap(800, this.pos[0]);
      this.pos[1] = this.dimSnap(500, this.pos[1]);
    },
    
    mass: function () {
      return Math.pow(this.radius, 2);
    },
    
    momentum: function () {
      var mass = this.mass();
      return this.vel.map(function (dir) {
        return dir * mass;
      });
    },
    
    move: function () {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
      this.handleWalls();
    },
    
    rangeSnap: function (min, max, pos) {
      if (pos <= min) {
        return min;
      } else if (pos >= max) {
        return max;
      } else {
        return pos;
      }
    },
    
    render: function (ctx) {
      ctx.fillStyle = "black";
      ctx.lineWidth = this.radius / 10;
      ctx.beginPath();

      ctx.arc(
        this.pos[0],
        this.pos[1],
        this.radius - (ctx.lineWidth / 2),
        0,
        Math.PI * 2
      );

      ctx.strokeStyle = this.color;
      ctx.stroke();
    }
    
  });

  _(Bubble).extend({
    random: function (board) {
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
