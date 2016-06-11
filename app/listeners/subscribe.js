module.exports = function (socket, params) {
  params.redis.on('message', function(channel, message){
    try{
      var parsed = JSON.parse(message);
      console.log("Redis New Message", channel, parsed); //Debug
      if( parsed.send_to && (!parsed.send_to.length || parsed.send_to.indexOf(socket.uid) !== -1) ){
        delete parsed.send_to;
        console.log("Redis Message Sent", channel, parsed); //Debug
        socket.emit('server-message', parsed);
      }
    }catch(e){
      console.error(e);
    }
  });
};