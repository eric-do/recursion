// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  if (obj === null) { return "null"; }
  if (typeof obj === "string") {
    return '"' + obj + '"';
  }
  if (Array.isArray(obj)) {
    var arr = [];

    for (var i = 0; i < obj.length; i++) {
      arr.push(stringifyJSON(obj[i]));
    }
    return '[' + arr.join(',') + ']';
  }

  if (typeof obj === "object") {
    var arr = [];
    for (key in obj) {
      if (obj.hasOwnProperty(key)
          && (typeof obj[key] !== "function"
          && obj[key] !== undefined)) {
        arr.push(stringifyJSON(key) + ':' + stringifyJSON(obj[key]));
      }
    }
    return '{' + arr.join(',') + '}';
  }
  return obj.toString();

}
