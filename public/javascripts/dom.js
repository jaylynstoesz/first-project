var results = document.getElementById("results").childNodes;
var prevWindow = document.getElementById("prevWindow");
var charCount = document.getElementById("charCount");
charCount.innerHTML = 138 - prevWindow.innerHTML.length + " characters remaining";
// var tweet = document.getElementById("tweet-container");

var tags = "";
for (var i = 0; i < results.length; i++) {
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
