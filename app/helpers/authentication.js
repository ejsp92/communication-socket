var Promise = require('promise');
var request = require("request");

module.exports = new Authentication();

/*
 *
 */
function Authentication() {}

/*
 *
 */
Authentication.prototype.login = function (params) {
  // TODO implement
  return new Promise(function(resolve, reject){
    var user = {};
    resolve(user);
  });
};

/*
 *
 */
Authentication.prototype.logout = function (params) {
  // TODO implement
  return new Promise(function(resolve, reject){
    var user = {};
    resolve(user);
  });
};