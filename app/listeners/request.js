var logger = require('winston');
var request = require("request");

module.exports = function (socket, params) {
  socket.on('request-server', function (data) {
    logger.info('new request', {socket_uid: socket.uid, data: data, timestamp: Date.now(), pid: process.pid});
    try{
      data.method = data.method.toUpperCase();
      var options = {
        url: params.config.apiEndpoint + data.path,
        method: data.method,
        headers: data.headers
      };

      if(data.method === 'GET'){
        options.qs = data.params;
      }else{
        options.json = data.params;
      }

      request(options, function(error, response, body) {
        try{
          logger.info('response error', {error: error, timestamp: Date.now(), pid: process.pid});
          logger.info('response code status', {code: response.statusCode, timestamp: Date.now(), pid: process.pid});
        }catch(e){}
      });
    }catch(e){
      console.error(e);
    }
  });
};
