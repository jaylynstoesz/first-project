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
    var results = {};
    for (var i = 0; i < parse.length; i++) {
      var count = 0;
      var word = parse[i];
      for (var j = 0; j < parse.length; j++) {
        if (word === parse[j]) {
          count++;
          if (count >= 5) {
            results[word] = word;
          }
        }
      }
    }
    return results;
  }

};
