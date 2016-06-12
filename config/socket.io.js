var socketIO = require('socket.io');
var redisClient = require('redis');
var url = require('url');
var glob = require('glob');
var logger = require('winston');

module.exports = function (server, config) {
  var utils = require(config.root + '/app/helpers/utils.js');
  var authentication = require(config.root + '/app/helpers/authentication.js');
  var manager = require(config.root + '/app/helpers/manager.js');

  /*
   * Start Redis Subscribe
   *
   * Server Message Structure
   * message = {
   *   type: 'change',
   *   resource: 'User',
   *   action: 'update',
   *   resource_content: {
   *     id: 1,
   *     name: 'Fred Moura'
   *   },
   *   recipient_uids: []
   *  }
   */
  var redis = redisClient.createClient(config.db);
  redis.subscribe('server-message');

  /*
   * Listeners
   */
  var list = [];
  var listeners = [];
  list = glob.sync(config.root + '/app/listeners/**/*.js');
  list.forEach(function (listener) {
    listeners.push(require(listener));
  });

  /*
   * Start Socket Server
   */
  var io = socketIO(server, config.socket.options);

  /*
   * Socket Authentication
   */
  io.use(function(socket, next){
    try{
      var requestUrl = url.parse(socket.request.url);
      var requestQuery = requestUrl.query;
      var requestParams = requestQuery.split("&");

      var params = {};
      for (var i=0;i<requestParams.length;i++) {
        var pair = requestParams[i].split("=");
            // If first entry with this name
        if (typeof params[pair[0]] === "undefined") {
          params[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof params[pair[0]] === "string") {
          var arr = [ params[pair[0]],decodeURIComponent(pair[1]) ];
          params[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          params[pair[0]].push(decodeURIComponent(pair[1]));
        }
      }

      authorization = JSON.parse(params.authorization);
      logger.info('new request', {request_url: socket.request.url, authorization: authorization, timestamp: Date.now(), pid: process.pid});

      authentication.login(authorization).then(function(user){
        logger.info('authenticated', {request_url: socket.request.url, authorization: authorization, user: user, timestamp: Date.now(), pid: process.pid});
        socket.uid = user.uid;
        socket.user = user;
        next();
      }, function () {
        logger.info('unauthorized', {request_url: socket.request.url, authorization: authorization, timestamp: Date.now(), pid: process.pid});
        next(new Error('Unauthorized'));
      });
    }catch(e){
      logger.info('Unexpected Error', {request_url: socket.request.url, authorization: authorization, timestamp: Date.now(), pid: process.pid});
      next(new Error('Unexpected Error'));
    }
  });

  /*
   * On Connection Socket Server
   */
  io.on('connection', function (socket) {
      manager.add(socket);

      /*
       * Apply Listeners
       */
      listeners.forEach(function (listener) {
        listener(socket, {
          redis: redis,
          manager: manager,
          config: config
        });
      });

      socket.once('disconnect', function(){
        authentication.logout(socket);
      });
  });
};