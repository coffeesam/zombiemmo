
/**
 * Module dependencies.
 */

var express = require('express')
  , routes  = require('./routes')
  , realm   = require('./routes/realm')
  , http    = require('http')
  , path    = require('path')
  , io      = require('socket.io');

var app         = express()
  , server      = require('http').createServer(app)
  , io          = io.listen(server)
  , gameServer  = require('./lib/gameServer');

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get ('/realm/:realm', realm.index);

server.listen(3000);
gameServer.listen(io);
