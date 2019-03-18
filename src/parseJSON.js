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

    // If json has members
    if (json.indexOf(',') !== -1) {
      console.log('member');
    }

    // If json is a pair
    if (json.indexOf(':') !== -1) {
      console.log('pair');
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

  function processMembers(json) {

  }

  function processPairs(str, obj) {
    var regex = /[\[\{\,]+/g;
    var colonIndex = str.indexOf(':');
    var key = clean(str.substring(0, colonIndex));
    var strRemainder = str.substring(colonIndex + 1);

    if (strRemainder.search(regex) === -1) {
      obj[key] = clean(strRemainder);
      return obj;
    } else {
      obj[key] = checkType(clean(strRemainder));
    }

    if ((strRemainder.indexOf(',') >= 0 && strRemainder.search(/[\[\{]+/g) >= 0)
        && strRemainder.indexOf(',') < strRemainder.search(/[\[\{]+/g)
        || (strRemainder.indexOf(',') >= 0 && strRemainder.search(/[\[\{]+/g) === -1)) {
      obj[key] = clean(strRemainder.slice(0, strRemainder.indexOf(',')));
      strRemainder = strRemainder.slice(strRemainder.indexOf(',') + 1);
      processPairs(strRemainder, obj);
    }
  }

  function processArray(json) {
    var str = getBody(json);
    return processElements(str);
  }

  function processValues(json) {

  }

  function processElements(json) {
    if (json.length > 0) {
      return json.split(',').map(function(x) { return clean(x); });
    } else {
      return [];
    }
  }

  function replaceCharactersInKeys(str, original, placeholder) {
    var regex = /\"(.*?)\"/g
    return str.replace(regex, function(match) {
             return match.replace(original, placeholder);
           });
  }

  function clean(string) {
    // Clean() will:
      // Remove leading/trailing whitespaces
      // Remove double quotes from string TODO this is not a good idea - CHANGE
      // Return number if string is a number
      // Return literal if it corresponds to null, true/false, undefined
      // Else return string
    var str = string.trim().replace(/["]/g, '');
    if (!isNaN(str) && str.length > 0) {
      var number = +str;
      return number;
    }
    str = str.replace('##', ',');
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
