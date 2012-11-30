exports.listen = function(io) {
  var playerDB = {};
  
  io.sockets.on ('connection', function(socket) {
    if(!playerDB.hasOwnProperty(socket.id)) {
      var x = Math.floor((Math.random()*60)+1);
      var y = Math.floor((Math.random()*300)+400);
      playerDB[socket.id] = {x: x, y: y};
    }
    socket.emit('join', {id: socket.id, x: playerDB[socket.id].x, y: playerDB[socket.id].y});
    socket.broadcast.emit('new', {id: socket.id, x: playerDB[socket.id].x, y: playerDB[socket.id].y});
  
    socket.on('update', function(m) {    
      socket.broadcast.emit('gameUpdate', {id: socket.id, z: m['z']}) ;
    });

    socket.on('message', function(m) {
      console.log(m)
    });

    socket.on('getPlayers', function(m) {
      for(var id in playerDB) {
        if(id !== socket.id)
          socket.emit('new', {id: id, x: playerDB[id].x, y: playerDB[id].y});
      }
    });

    socket.on('disconnect', function(data) {
      io.sockets.emit('playerLeave', {id: socket.id});
      playerDB.remove(socket.id);
    });
  });
}