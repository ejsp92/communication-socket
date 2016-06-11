var socketIO = require('socket.io');
var glob = require('glob');
var redis = require('redis');

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
   *   content: {
   *     id: 1,
   *     name: 'Fred Moura'
   *   },
   *   send_to: []
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
      authentication.login(data).then(function(user){
        console.log("Authenticated :: ", data, user);
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
        console.log("Unauthorized :: ", data); //Debug
        socket.disconnect(true);
      });
    });
  });
};