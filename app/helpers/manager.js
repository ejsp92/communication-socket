var createTree = require("functional-red-black-tree");
var logger = require('winston');

module.exports = new Manager();

/*
 *
 */
function Manager() {
  this.sockets = createTree();
}

/*
 *
 */
Manager.prototype.add = function(socket){
  var _this = this;
  this.sockets.remove(socket.uid);
  this.sockets.insert(socket.uid, socket);

  socket.once('disconnect', function(){
    _this.sockets.remove(socket.uid);
    logger.info('socket removed of the manager on disconnect', {socket_uid: socket.uid, timestamp: Date.now(), pid: process.pid});
  });
  logger.info('new socket added in manager', {socket_uid: socket.uid, timestamp: Date.now(), pid: process.pid});
};

/*
 *
 */
Manager.prototype.get = function(uid){
  return this.sockets.get(uid);
};

/*
 *
 */
Manager.prototype.remove = function(uid){
  return this.sockets.remove(uid);
};

/*
 *
 */
Manager.prototype.isOnline = function(uid){
  return this.sockets.find(uid) !== null;
};