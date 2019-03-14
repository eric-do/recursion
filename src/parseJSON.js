// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  var literalMap = {
    "null"      : null,
    "true"      : true,
    "false"     : false,
    "undefined" : undefined
  };

  console.log('input string: ' + json);
  console.log('expected: ' + JSON.stringify(json));

  // If json is an array
  if (json[0] === '[' && (json[json.length - 1] === ']')) {
    var arr = [];
    var str = getBody(json);
    if (str.length > 0) {
      arr = str.split(',').map(function(x) { return clean(x); });
      console.log(arr);
    }
    console.log('actual: ' + JSON.stringify(arr));
    return arr;
  }

  // If json is an object, e.g. '{"foo": ""}'
  if (json[0] === '{' && (json[json.length - 1] === '}')) {
    var obj = {};
    var regex = /\"(.*?)\"/g
    var str = getBody(json);

    if (str.length > 0) {
      str = replaceCommasInKeyVals(str);
      console.log('string body: ' + str);
      var pairsArr = str.split(',');
      pairsArr.forEach(function(keyVal) {
        var propArr = keyVal.split(':');
        var key = propArr[0] ? clean(propArr[0]) : propArr[0];
        var val = propArr[1] ? clean(propArr[1]) : propArr[1];
        obj[key] = val;
      })

    }
    console.log('actual: ' + JSON.stringify(obj));
    return obj;
  }

  function replaceCommasInKeyVals(str) {
    return str.replace(regex, function(match) {
             return match.replace(',', '##');
           });
  }

  function replacePlaceholderWithComma(str) {
    return str.replace('##', ',');
  }

  function clean(string) {
    var str = string.trim().replace(/["]/g, '');
    if (!isNaN(str) && str.length > 0) {
      var number = +str;
      return number;
    }
    str = replacePlaceholderWithComma(str);
    return checkLiteral(str);
  }

  function checkLiteral(string) {
    if (string in literalMap) {
      return literalMap[string];
    }
    return string;
  }

  function getBody(string) {
    return string.substring(1, json.length - 1);
  }
};
