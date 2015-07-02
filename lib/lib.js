var lists = require('./lists');

module.exports = {

  errorGen: function(handle, password, confirm) {
    var errorsList = [];
      if (!handle) {
        var blankErr = "Handle can not be blank.";
        errorsList.push(blankErr);
      }
      if (!password) {
        var blankPassErr = "Password can not be blank.";
        errorsList.push(blankPassErr);
      }
      if (password.length < 8) {
        var lengthErr = "Your password must be at least 8 characters.";
        errorsList.push(lengthErr);
      }
      if (password !== confirm) {
        var matchErr = "Your password doesn't match. Please try again.";
        errorsList.push(matchErr);
      }
    return errorsList;
  },

  getKeywords: function(input) {
    function clean(entry) {
        return entry !== "";
      }
    var rep = input.replace(/(\.|,|\/|\n|\r|\u2014|\u201D|\u201C|\u0027|\u2019|\u2022)/g, " ").replace(/(-|_|#|\?|\!|'|")/g, "");
    var parse = rep.split(" ").filter(clean).sort();
    console.log(parse.length);
    for (var x = 0; x < lists.articles.length; x++) {
      for (var y = 0; y < parse.length; y++) {
        if (parse[y].toLowerCase() === lists.articles[x]) {
          parse[y] = "";
        }
      }
    }
    var results = {};
    for (var i = 0; i < parse.length; i++) {
      var word = parse[i];
      var count = 0;
      for (var j = 0; j < parse.length; j++) {
        if (word === parse[j] && word !== "") {
          count++;
          if (parse.length > 1000 && count >= 5) {
              results[word] = word;
          } else if (parse.length < 1000 && count >= 3) {
            results[word] = word;
          }
        }
      }
    }
  console.log(results);
  return results;
  }

};
