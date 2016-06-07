module.exports = function (socket, params) {
  params.redis.on('message', function(channel, message){
    var messageParsed = JSON.parse(message);
    console.log("Redis New Message", channel, messageParsed);
    if( messageParsed.sendTo && (!messageParsed.sendTo.length || messageParsed.sendTo.indexOf(socket.uid) !== -1) ){
      delete messageParsed.sendTo;
      console.log("Redis Message Sent", channel, messageParsed);
      socket.emit('server-message', messageParsed);
    }
  });
};