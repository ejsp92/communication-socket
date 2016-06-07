var request = require("request");

module.exports = function (socket, params) {
  socket.on('request-server', function (data) {
    var options = {
      uri: params.config.apiEndpoint + data.path,
      method: data.method,
      json: data.params,
      headers: data.headers
    };

    request(options, function(error, response, body) {
      console.log("Resquest - error :: ", error);
      console.log("Resquest - response :: ", response);
      console.log("Resquest - body :: ", body);
    });
  });
};
