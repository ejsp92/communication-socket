var Promise = require('promise');
var request = require("request");
var redisClient = require('redis');
var logger = require('winston');

module.exports = new Authentication();

/*
 *
 */
function Authentication() {
  this.onlineSocketsKey = 'online-sockets';
  this.redis = null;
}

/*
 * Set Online
 */
Authentication.prototype.initRedis = function (db) {
  this.redis = redisClient.createClient(db);
};

/*
 * Authenticate
 */
Authentication.prototype.authenticate = function (params) {
  // TODO implement
  return new Promise(function(resolve, reject){
    var user = { uid: 'bf58a38bcea50effc0df914370b69afc7afaad2f5758caaa'};
    resolve(user);
  });
};

/*
 * Set Online
 */
Authentication.prototype.setOnline = function (socket) {
  logger.info('set online', {uid: socket.uid, timestamp: Date.now(), pid: process.pid});
  return this.redis.sadd(this.onlineSocketsKey, socket.uid);
};

/*
 * Set Offline
 */
Authentication.prototype.setOffline = function (socket) {
  logger.info('set offline', {uid: socket.uid, timestamp: Date.now(), pid: process.pid});
  return this.redis.srem(this.onlineSocketsKey, socket.uid);
};

/*
 * Is Online
 */
Authentication.prototype.isOnline = function (socket) {
  var _this = this;
  return new Promise(function(resolve, reject){
    _this.redis.sismember(_this.onlineSocketsKey, socket.uid, function (err, reply) {
      var online = (reply == 1)
      logger.info('is online', {uid: socket.uid, reply: online, err: err, timestamp: Date.now(), pid: process.pid});
      if (err) return reject(err);
      resolve(online);
    });
  });
};

/*
 * Clean Setted Online
 */
Authentication.prototype.clean = function () {
  return this.redis.del(this.onlineSocketsKey);
};