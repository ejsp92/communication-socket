var request = require("request");

module.exports = function (socket, params) {
  socket.on('request', function (data) {
    // TODO implement authentication for request api
    var options = {
      uri: params.config.apiEndpoint + data.path,
      method: data.method,
      json: data.params,
      headers: data.headers
    };

    request(options, function(error, response, body) {
      console.log("Resquest :: ", response);
    });
  });
};
