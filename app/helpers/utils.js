module.exports = new Utils();

/*
 *
 */
function Utils() {}

/*
 *
 */
Utils.prototype.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
};

/*
 *
 */
Utils.prototype.filenameOf = function(path){
  return path.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, '');
};

/*
 *
 */
Utils.prototype.parameterizeFilenameOf = function(path){
  var filename = this.filenameOf(path);
  var list = filename.split("_");

  list.forEach(function(substring, index){
    list[index] = substring.charAt(0).toUpperCase() + substring.slice(1);
  });
  return list.join("");
};

/*
 *
 */
Utils.prototype.getQueryParams = function(urlParsed){
  var query = urlParsed.query;
  var requestParams = query.split("&");
  var params = {};
  for (var i=0;i<requestParams.length;i++) {
    var pair = requestParams[i].split("=");
        // If first entry with this name
    if (typeof params[pair[0]] === "undefined") {
      params[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
    } else if (typeof params[pair[0]] === "string") {
      var arr = [ params[pair[0]],decodeURIComponent(pair[1]) ];
      params[pair[0]] = arr;
        // If third or later entry with this name
    } else {
      params[pair[0]].push(decodeURIComponent(pair[1]));
    }
  }
  return params;
};