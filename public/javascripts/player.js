Crafty.c("player", {
  _keys: { 
   UP_ARROW: [0,-1],
   DOWN_ARROW: [0,1],
   RIGHT_ARROW: [1,0],
   LEFT_ARROW: [-1,0],
  },
  
  direction: {x: 0, y: 0},  
   
  init: function() {
    this.requires('SpriteAnimation, Multiway, Collision, Grid, heroSprite, SpriteColor, hero1')
    .animate("walk_left",  4,  0, 11)
    .animate("walk_right", 4,  4, 11)
    .animate("walk_up",    4,  2, 11)
    .animate("walk_down",  4,  6, 11)
    .animate("walk_ne",    4,  3, 11)
    .animate("walk_nw",    4,  1, 11)
    .animate("walk_se",    4,  5, 11)
    .animate("walk_sw",    4,  7, 11)
    .animate("attk_left",  24, 0, 31)
    .animate("attk_right", 24, 4, 31)
    .animate("attk_up",    24, 2, 31)
    .animate("attk_down",  24, 6, 31)
    .animate("attk_ne",    24, 3, 31)
    .animate("attk_nw",    24, 1, 31)
    .animate("attk_se",    24, 5, 31)
    .animate("attk_sw",    24, 7, 31)

    .bind("NewDirection",
        function (direction) {
          var newDirection = 'stop';
          if (direction.x < 0 && direction.y == 0) {
              if (!this.isPlaying("walk_left"))
                  this.stop().animate("walk_left", 30, -1);
              newDirection = "walk_left";
          }
          if (direction.x > 0 && direction.y == 0) {
              if (!this.isPlaying("walk_right"))
                  this.stop().animate("walk_right", 30, -1);
              newDirection = "walk_right";
          }
          if (direction.y < 0 && direction.x == 0) {
              if (!this.isPlaying("walk_up"))
                  this.stop().animate("walk_up", 30, -1);
              newDirection = "walk_up";
          }
          if (direction.y > 0 && direction.x == 0) {
              if (!this.isPlaying("walk_down"))
                  this.stop().animate("walk_down", 30, -1);
              newDirection = "walk_down";
          }
          if (direction.x < 0 && direction.y < 0) {
              if (!this.isPlaying("walk_nw"))
                  this.stop().animate("walk_nw", 30, -1);
              newDirection = "walk_nw";
          }
          if (direction.x < 0 && direction.y > 0) {
              if (!this.isPlaying("walk_sw"))
                  this.stop().animate("walk_sw", 30, -1);
              newDirection = "walk_sw";
          }
          if (direction.y < 0 && direction.x > 0) {
              if (!this.isPlaying("walk_ne"))
                  this.stop().animate("walk_ne", 30, -1);
              newDirection = "walk_ne";
          }
          if (direction.y > 0 && direction.x > 0) {
              if (!this.isPlaying("walk_se"))
                  this.stop().animate("walk_se", 30, -1);
              newDirection = "walk_se";
          }
          if(!direction.x && !direction.y) {
              this.stop();
          }
          if(!(direction.x == 0 && direction.y == 0)) {
            this.direction = direction;
          }
          this.trigger("update", {z: newDirection});
          //Crafty("hero1").addComponent("Tween").animate("walk_right",24,1).tween({x: 300, y: 500}, 800)
    })
    .multiway(2, {W: -90, S: 90, D: 0, A: 180})
    .bind('Moved', function() {
      if(this.hit('solid')){
          //this.attr({x: from.x, y:from.y});
      }
    })
    .onHit('zombie', function() {
      this.damage();
    });
    return this;
  },
  
  damage: function() {
    this.spriteColor("FF0000", 0.4);
    Crafty.e("RealDelay").realDelay(function() {
      this.spriteColor("FF0000", 0);
    }, 200);
  }
  
  
});