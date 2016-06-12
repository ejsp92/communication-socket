var socketIO = require('socket.io');
var glob = require('glob');
var redis = require('redis');
var logger = require('winston');

module.exports = function (server, config) {
  var utils = require(config.root + '/app/helpers/utils.js');
  var authentication = require(config.root + '/app/helpers/authentication.js');
  var manager = require(config.root + '/app/helpers/manager.js');

  var redisClient = redis.createClient(config.db);
  redisClient.subscribe('server-message');
  /*
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

  var socketServer = socketIO(server, config.socket.options);

  var list = [];
  /*
   * Listeners
   */
  var listeners = [];
  list = glob.sync(config.root + '/app/listeners/**/*.js');
  list.forEach(function (listener) {
    listeners.push(require(listener));
  });

  /*
   * Init Socket Server
   */
  socketServer.on('connection', function (socket) {
    socket.on('authentication', function (data) {
      logger.info('new request authentication', {data: data, timestamp: Date.now(), pid: process.pid});
      authentication.login(data).then(function(user){
        logger.info('authenticated', {data: data, user: user, timestamp: Date.now(), pid: process.pid});
        socket.uid = user.uid;
        socket.user = user;

        manager.add(socket);
        /*
         * Apply Listeners
         */
        listeners.forEach(function (listener) {
          listener(socket, {
            redis: redisClient,
            manager: manager,
            config: config
          });
        });

        socket.once('disconnect', function(){
          authentication.logout(data);
        });

        socket.emit('authenticated');
      }, function(){
        logger.info('unauthorized', {data: data, timestamp: Date.now(), pid: process.pid});
        socket.disconnect(true);
      });
    });
  });
};