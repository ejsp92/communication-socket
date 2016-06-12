var Promise = require('promise');
var request = require("request");

module.exports = new Authentication();

/*
 *
 */
function Authentication() {}

/*
 * Login
 */
Authentication.prototype.login = function (params) {
  // TODO implement
  return new Promise(function(resolve, reject){
    var user = { uid: 'bf58a38bcea50effc0df914370b69afc7afaad2f5758caaa'};
    resolve(user);
  });
};

/*
 * Logout
 */
Authentication.prototype.logout = function (params) {
  // TODO implement
  return new Promise(function(resolve, reject){
    var user = { uid: 'bf58a38bcea50effc0df914370b69afc7afaad2f5758caaa'};
    resolve(user);
  });
};