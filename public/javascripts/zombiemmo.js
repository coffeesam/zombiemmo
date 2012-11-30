var ZombieMMO = function() {
  this.self = this;
  this.interval = new Object();
}

ZombieMMO.prototype.init = function() {
  var self = this;

  Crafty.init(980, 700);

  Crafty.scene("loading", function () {
      //black background with some loading text
      Crafty.background("#000");
      Crafty.e("2D, DOM, Text").attr({ w: 100, h: 20, x: 350, y: 220 })
              .text("Loading...")
              .css({"text-align": "center", "color": "#fff", "z-index":999});
      //load takes an array of assets and a callback when complete
      Crafty.load(["/images/grassland-tiles.png", "/images/medieval-building-tiles.png",
      "/images/orc_archer.png",
      ], function () {
        Crafty.scene("main"); //when everything is loaded, run the main scene
      });      
  });
  
  Crafty.scene("main", function() {
    self.createSprites();
    self.generateWorld();
  });
  Crafty.scene("loading");
};

ZombieMMO.prototype.createSprites = function () {
  Crafty.sprite(128, "images/orc_archer.png", {
    heroSprite: [0,0]
  });
}

ZombieMMO.prototype.generateWorld = function() {
  var self = this;
  var socket = io.connect();
  var player;
  socket.on('connect', function () {
    socket.on('join', function (playerInfo) {
      Crafty.e('TiledLevel').tiledLevel("/game_data/map.json", "Canvas", function() {
        player = self.createPlayer(playerInfo.id, playerInfo.x, playerInfo.y);
        player.bind("update", function(move) {
          socket.emit("update", move);
        })
      }).bind("TiledLevelLoaded", function() {
        Crafty.viewport.clampToEntities = true;
        setTimeout(function() {
          socket.emit('getPlayers', 'all');
          //Crafty.viewport.centerOn(player, 1);
          self.startDrag();
        }, 1000);
      });
    });

    socket.on('new', function(playerInfo) {
      self.createNetworkPlayer(playerInfo.id, playerInfo.x, playerInfo.y);
    });

    socket.on('playerLeave', function(playerInfo) {
      if(Crafty(playerInfo.id).length > 0) {
        Crafty(playerInfo.id).destroy();
      }
    });

    socket.on('gameUpdate', function(playerInfo) {
      var z = playerInfo.z;
      var networkPlayer = Crafty(playerInfo.id);
      if(!networkPlayer.isPlaying(playerInfo.z) && z !== "stop") {
        clearInterval(networkPlayer.interval);
        networkPlayer.interval = setInterval(function() {
          var toX = 0, toY = 0, x = 0, y = 0;
          if(z === "walk_right" || z === "walk_ne" || z === "walk_se") {
            x = 2;
          }
          if(z === "walk_left" || z === "walk_nw" || z === "walk_sw") {
            x = -2;
          }
          if(z === "walk_up" || z === "walk_nw" || z === "walk_ne") {
            y = -2;
          }
          if(z === "walk_down" || z === "walk_sw" || z === "walk_se") {
            y = 2;
          }
          toX = networkPlayer.x + x;
          toY = networkPlayer.y + y;
          networkPlayer.startMove(toX, toY, z);
        }, 20);
      }else if(z == "stop") {
        clearInterval(networkPlayer.interval);
        networkPlayer.stop();
      }
    });
  });
};

ZombieMMO.prototype.createNetworkPlayer = function(id, x, y) {
  if(Crafty(id).length === 0)
    Crafty.e("2D, Canvas, Tween, networkPlayer, Multiway, Grid, drone, " + id).attr({playerId: id, x: x, y: y}).collision();
}

ZombieMMO.prototype.createPlayer = function(id, x, y) {
  return Crafty.e("2D, Canvas, Tween, Multiway, Collision, solid, player, hero1, " + id).attr({playerId: id, x: x, y: y}).collision();
}

ZombieMMO.prototype.startDrag = function() {
  Crafty.addEvent(this, Crafty.stage.elem, "mousedown", function(e) {
    if(e.button > 1) return;
    var base = {x: e.clientX, y: e.clientY};

    function scroll(e) {
      var dx = base.x - e.clientX,
        dy = base.y - e.clientY;
        base = {x: e.clientX, y: e.clientY};
      Crafty.viewport.x -= dx;
      Crafty.viewport.y -= dy;
    };

    Crafty.addEvent(this, Crafty.stage.elem, "mousemove", scroll);
    Crafty.addEvent(this, Crafty.stage.elem, "mouseup", function() {
      Crafty.removeEvent(this, Crafty.stage.elem, "mousemove", scroll);
    });
  });
}

var zombieMMO = new ZombieMMO();