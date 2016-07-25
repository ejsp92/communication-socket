var logger = require('winston');
var request = require("request");

module.exports = function (socket, params) {
  socket.on('request-server', function (data) {
    logger.info('new request', {socket_uid: socket.uid, data: data, timestamp: Date.now(), pid: process.pid});
    try{

      if(typeof data !== "string") data = JSON.stringify(data);
      params.redis.publish("client-message", data);

    }catch(e){
      logger.error(e);
    }
  });
};
