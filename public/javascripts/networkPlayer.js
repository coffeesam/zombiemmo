Crafty.c("networkPlayer", {
   
  interval: new Object(),
   
  init: function() {
    this.requires('SpriteAnimation, Tween, Multiway, Collision, Grid, heroSprite, SpriteColor')
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

    return this;
  },
    
  startMove: function(x, y, z) {
    this.animate(z,30,0).tween({x: x, y: y }, 1);
  },
  
  damage: function() {
    this.spriteColor("FF0000", 0.4);
    Crafty.e("RealDelay").realDelay(function() {
      this.spriteColor("FF0000", 0);
    }, 200);
  }
  
  
});