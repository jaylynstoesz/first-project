var results = document.getElementById("results").childNodes;
var prevWindow = document.getElementById("prevWindow");
var charCount = document.getElementById("charCount");
charCount.innerHTML = 138 - prevWindow.innerHTML.length + " characters remaining";
// var tweet = document.getElementById("tweet-container");

function getCookies(input) {
  var results = input.replace(/ /g, "").split(";");
  var obj = {};
  for (var i = 0; i < results.length; i++) {
    var key = results[i].split("=")[0];
    var value = results[i].split("=")[1];
    obj[key] = value;
  }
  return obj;
}
var description = getCookies(document.cookie).description.split("%2C");

var tags = "";
for (var i = 0; i < results.length; i++) {
  for (var j = 0; j < description.length; j++) {
    if (results[i].id === description[j]) {
      results[i].style.backgroundColor = "rgb(255, 255, 153)";
      results[i].style.color = "black";
    }
  }
  results[i].onclick = function() {
    if (prevWindow.value.length + this.id.length > 138) {
      console.log(this.id.length);
      this.onclick = function() { return false; };
      prevWindow.innerHTML = prevWindow.value;
    } else {
      prevWindow.value += " #" + this.id;
      prevWindow.innerHTML = prevWindow.value;
      charCount.innerHTML = 138 - prevWindow.value.length + " characters remaining";
      tags += this.id + ",";
      this.style.backgroundColor = "silver";
      if (prevWindow.value.length >= 128) {
        charCount.style.color = "red";
        console.log(charCount);
      } else {
        charCount.style.color = "black";
      }
    }
    // tweet.hashtags = tags;
  console.log(tags);
  };
}

prevWindow.onkeyup = function () {
  charCount.innerHTML = 138 - this.value.length + " characters remaining";
  if (this.value.length >= 128) {
    charCount.style.color = "red";
    console.log(charCount);
  } else {
    charCount.style.color = "black";
  }
};
