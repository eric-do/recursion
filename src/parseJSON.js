// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  console.log('input string: ' + json);
  console.log('expected: ' + JSON.stringify(json));

  return checkType(json);

  // If json is an array
  function checkType(json) {
    if (json[0] === '[' && (json[json.length - 1] === ']')) {
      return processArray(json);
    }

    // If json is an object, e.g. '{"foo": ""}'
    if (json[0] === '{' && (json[json.length - 1] === '}')) {
      return processObject(json);
    }
    // Else json is a value
    return clean(json);
  }

  function getBody(string) {
    return string.substring(1, string.length - 1);
  }

  // If json is a string
  function processObject(json) {
    var obj = {};
    var str = getBody(json);

    if (str.length > 0) {
      processPairs(str, obj);
    }
    return obj;
  }

  function processPairs(str, obj) {
    var regex = /[\[\{\,]+/g;
    var colonIndex = str.indexOf(':');
    var key = clean(str.substring(0, colonIndex));
    var strRemainder = str.substring(colonIndex + 1);

    if (strRemainder.search(regex) === -1) {
      obj[key] = clean(strRemainder);
      return obj;
    } else if ((strRemainder.indexOf(',') >= 0 && strRemainder.search(/[\[\{]+/g) >= 0)
        && strRemainder.indexOf(',') < strRemainder.search(/[\[\{]+/g)
        || (strRemainder.indexOf(',') >= 0 && strRemainder.search(/[\[\{]+/g) === -1)) {
      obj[key] = clean(strRemainder.slice(0, strRemainder.indexOf(',')));
      strRemainder = strRemainder.slice(strRemainder.indexOf(',') + 1);
      return processPairs(strRemainder, obj);
    } else if ((strRemainder. indexOf(',') >= 0 && strRemainder.search(/[\]\}]+/g) >= 0)
        && strRemainder.indexOf(',') > strRemainder.search(/[\]\}]+/g)) {
      obj[key] = checkType(clean(strRemainder.slice(0, strRemainder.indexOf(','))));
      strRemainder = strRemainder.slice(strRemainder.indexOf(',') + 1);
      return processPairs(strRemainder, obj);
    } else {
      obj[key] = checkType(clean(strRemainder));
    }
  }

  function processArray(json) {
    var arr = [];
    var str = getBody(json);
    if (str.length > 0) {
      arr = processMembers(str);
    }
    return arr;

    function processMembers(str) {
      var regex = /[\[\{\,]+/g;

      if (typeof str === 'object') {
        arr.push(str);
        return arr;
      } else if (str.search(regex) === -1) {
        arr.push(clean(str));
        return arr;
      } else if ((str.indexOf(',') >= 0 && str.search(/[\[\{]+/g) >= 0)
          && str.indexOf(',') < str.search(/[\[\{]+/g)
          || (str.indexOf(',') >= 0 && str.search(/[\[\{]+/g) === -1)) {
        var member = clean(str.slice(0, str.indexOf(',')));
        arr.push(member);
        var strRemainder = str.slice(str.indexOf(',') + 1);
        return processMembers(strRemainder);
      } else if (str.indexOf(',') > str.search(/[\]\}]+/g)){
        var member = clean(str.slice(0, str.indexOf(',')));
        arr.push(checkType(member));
        var strRemainder = str.slice(str.indexOf(',') + 1);
        return processMembers(checkType(strRemainder.trim()));
      } else {
        arr.push(checkType(str));
        return arr;
      }
    }
  }

  function processValues(json) {

  }

  function replaceCharactersInKeys(str, original, placeholder) {
    var regex = /\"(.*?)\"/g
    return str.replace(regex, function(match) {
             return match.replace(original, placeholder);
           });
  }
//["\\""a""]
//["\\""a""]

 function escapeSpecialChars(str) {
  return str.replace(/\\n/g, "\n")
             .replace(/\\'/g, "\'")
             .replace(/\\"/g, '\"')
             .replace(/\\&/g, "\&")
             .replace(/\\r/g, "\r")
             .replace(/\\t/g, "\t")
             .replace(/\\b/g, "\b")
             .replace(/\\f/g, "\f");
  };

  function clean(string) {
    // Clean() will:
      // Remove leading/trailing whitespaces
      // Remove leading/trailing quotes
      // Return number if string is a number
      // Return literal if it corresponds to null, true/false, undefined
      // Else return string
    var str = escapeSpecialChars(string.trim().replace(/(^")|("$)/g, ''));
    if (!isNaN(str) && str.length > 0) {
      var number = +str;
      return number;
    }
    return checkLiteral(str);
  }

  function checkLiteral(string) {
    // This function checks to see if the string is null/true/false/undefined
    // and returns the literal otherwie returns the string
    var literalMap = {
      "null"      : null,
      "true"      : true,
      "false"     : false,
      "undefined" : undefined
    };

    if (string in literalMap) {
      return literalMap[string];
    }
    return string;
  }
};
