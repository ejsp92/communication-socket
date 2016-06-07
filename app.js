var express = require('express'),
  http = require('http'),
  config = require('./config/config'),
  glob = require('glob');

var app = express();
require('./config/express')(app, config);

var server  = http.Server(app);
require('./config/socket.io')(server, config);

server.listen(config.port, function () {
  console.log('Express server listening on port ' + config.port);
});

