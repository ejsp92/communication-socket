var createTree = require("functional-red-black-tree");

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
    console.log("Socket Remove in Manager After Disconnect :: ", socket.uid);
    _this.sockets.remove(socket.uid);
  });
  console.log("Socket Add in Manager :: ", socket.uid);
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