// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function(json) {
  return checkType(json);

  function checkType(json) {
    if (json[0] === '[' && json[json.length - 1] === ']') {
      var arr = processArray(json);
      return arr;
    }

    if (json[0] === '{' && json[json.length - 1] === '}') {
      return processObject(json);
    }
    return;
  }

  function processArray(json) {
    // JSON object is confirmed to be an array
    // Get body of the array
    // Process array body
    var arr = [];
    var arrStr = getOuterObject(json); // Returns the outermost array
    var body = getBody(arrStr);        // Returns body of outer array

    if (body.length > 0) {
      processMembers(body);
    }

    return arr;

    function processMembers(str) {
      // Receives body of array
      // If body is another object/array, call checkType to handle
      // If body is a value, push the next member to the array
      // If there are more members, slice the remaining body
      // Recursively call processMembers on the rest of the members
      if (str[0] === '[' || str[0] === '{') {
        var member = getOuterObject(str);
        arr.push(checkType(member));
      } else {
        var memArr = getValueString(str).split(',');
        var member = memArr[0];
        arr.push(clean(member));
      }
      if (str.length > member.length) {
        var strRemainder = str.slice(member.length);
        strRemainder = strRemainder.slice(strRemainder.indexOf(',') + 1);
        processMembers(strRemainder.trim());
      }
    }
  }

  function getBody(string) {
    return string.substring(1, string.length - 1);
  }

  // If json is a string
  function processObject(json) {
    var obj = {};
    var objStr = getOuterObject(json); // Returns the outermost object
    var body = getBody(objStr);        // Returns body of outer object

    if (body.length > 0) {
      processPairs(body);
    }

    return obj;

    function processPairs(str) {
      // Receives body of object
      // If body is another object/array, call checkType to handle
      // If body is a value, process the next pair
      // If the body contains more pairs, slice the remaining body
      // Recursively call processPairs on the rest of the pairs
      if (str[0] === '[' || str[0] === '{') {
        return checkType(str);
      } else {
        // The next set of open/close quotes is a key
        // The remainder of the body after the next colon is the key's value
        // (plus potential other pairs)
        var key = getValueString(str);
        var strRemainder = str.slice(key.length);
        strRemainder = strRemainder.slice(strRemainder.indexOf(':') + 1).trim();

        if (strRemainder[0] === '[' || strRemainder[0] === '{') {
          obj[clean(key)] = checkType(strRemainder);
          var val = strRemainder;
        } else {
          var val = strRemainder.indexOf(',') >= 0 ? strRemainder.slice(0, strRemainder.indexOf(',')) : strRemainder;
          obj[clean(key)] = clean(val);
        }

        // If there are more pairs after the value, we move the stringRemainder
        // past the previous value and after the following comma
        // Then we make the recursive call to processPairs
        if (strRemainder.length > val.length) {
          var tmp = strRemainder.substr(val.length);
          tmp = tmp.substr(tmp.indexOf(',') + 1);
          processPairs(tmp.trim());
        }
      }
    }
  }

  function getOuterObject(json) {
    var found = false;
    var count = 0;
    var index = 0;

    if (json[0] === '[') {
      while (found === false && index < json.length) {
        var char = json.charAt(index);
        if (char === '[') {
          count++;
        } else if (char === ']') {
          count--;
        }
        if (count === 0) {
          found = true;
        } else {
          index++;
        }
      }
    } else if (json[0] === '{') {
      while (found === false && index < json.length) {
        var char = json.charAt(index);
        if (char === '{') {
          count++;
        } else if (char === '}') {
          count--;
        }
        if (count === 0) {
          found = true;
        } else {
          index++;
        }
      }
    }
    return json.substr(0, index + 1);
  }

  function getValueString(str) {
    var index = 1;
    var found = false;
    while (found === false && index < str.length) {
      var char = str.charAt(index);
      if (char === '"') {
        found = true;
      }
      index++;
    }
    return str.substr(0, index);
  }

  function escapeSpecialChars(str) {
    var arr = [];
    for (i = 0; i < str.length;) {
      if (str[i] === '\\') {
        arr.push(str[i+1]);
        i += 2;
      } else {
        arr.push(str[i]);
        i += 1;
      }
    }
    return arr.join('');
  };

  function clean(string) {
    // Clean() will:
      // Remove leading/trailing whitespaces
      // Remove leading/trailing quotes
      // Return number if string is a number
      // Return literal if it corresponds to null, true/false, undefined
      // Else returns string
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
