var logger = require('winston');

module.exports = function (socket, params) {
  var onMessage = function(channel, message){
    try{
      var parsed = JSON.parse(message);
      logger.info('new server message', {socket_uid: socket.uid, channel: channel, message: message, timestamp: Date.now(), pid: process.pid});
      if( !parsed.recipient_uids || ( parsed.recipient_uids && (!parsed.recipient_uids.length || parsed.recipient_uids.indexOf(socket.uid) !== -1) ) ){
        delete parsed.recipient_uids;
        socket.emit('server-message', parsed);
      }
    }catch(e){
      logger.error(e);
    }
  };
  params.subscribe.on('message', onMessage);
  socket.once('disconnect', function(){
    params.subscribe.removeListener('message', onMessage);
    logger.info('redis subscribe removeListener on disconnect', {socket_uid: socket.uid, timestamp: Date.now(), pid: process.pid});
  });
};