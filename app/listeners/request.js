var request = require("request");

module.exports = function (socket, params) {
  socket.on('request-server', function (data) {
    try{
      data.method = data.method.toUpperCase();
      var options = {
        url: params.config.apiEndpoint + data.path,
        method: data.method,
        qs: data.params,
        json: data.params,
        headers: data.headers
      };

      if(data.method === 'GET')

      request(options, function(error, response, body) {
        /*
         * Debug
         */
        console.log("Resquest - error :: ", error);
        console.log("Resquest - response :: ", response.statusCode);
      });
    }catch(e){
      console.error(e);
    }
  });
};
