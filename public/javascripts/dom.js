var results = document.getElementById("results").childNodes;
var prevWindow = document.getElementById("prevWindow");
var charCount = document.getElementById("charCount");
charCount.innerHTML = 138 - prevWindow.innerHTML.length + " characters remaining";
var tweet = document.getElementById("tweet-container");

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
//
// twttr.widgets.createTimeline(
//   "600720083413962752",
//   document.getElementById("container"),
//   {
//     screenName: "fabric"
//   }
// );
//
// window.twttr = (function(d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0],
//     t = window.twttr || {};
//   if (d.getElementById(id)) return t;
//   js = d.createElement(s);
//   js.id = id;
//   js.src = "https://platform.twitter.com/widgets.js";
//   fjs.parentNode.insertBefore(js, fjs);
//
//   t._e = [];
//   t.ready = function(f) {
//     t._e.push(f);
//   };
//
//   return t;
// }(document, "script", "twitter-wjs"));
//
//
// !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');
