var lists = require('./lists');

module.exports = {
  errorGen: function(email, password, confirm) {
    var errorsList = [];
      if (!email) {
        var blankErr = "Email can not be blank.";
        errorsList.push(blankErr);
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
    var foo = input.replace(/(\.|,|\/|\n|\r|")/g, " ").replace(/('s|-)/g, "");
    var parse = foo.split(" ").filter(clean).sort();
    console.log(parse.length);

    var results = {};
    for (var i = 0; i < parse.length; i++) {
      var word = parse[i];
      var count = 0;
      for (var j = 0; j < parse.length; j++) {
        if (word === parse[j]) {
          count++;
          if (parse.length > 1000 && count >= 5) {
              results[word] = word;
          } else if (parse.length < 1000 && count >= 0.02 * parse.length) {
            results[word] = word;
          }
        }
      }
    }
    console.log(results);
    return results;
  }

};
