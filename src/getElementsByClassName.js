// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  var results = [];

  recursiveSearch(document.body);

  function recursiveSearch(node) {
    if (node.classList && node.classList.contains(className)){
      results.push(node);
    }
    if (node.childNodes && node.childNodes.length > 0) {
      for (var i = 0; i < node.childNodes.length; i++) {
        recursiveSearch(node.childNodes[i]);
      }
    }
  }
  return results;
};
