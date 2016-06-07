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