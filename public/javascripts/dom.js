// var db = require('monk')(process.env.MONGOLAB_URI);
// var userCollection = db.get('allUsers');

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);
  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };
  return t;
}(document, "script", "twitter-wjs"));

var results = document.getElementById("results").childNodes;
var prevWindow = document.getElementById("prevWindow");
var charCount = document.getElementById("charCount");
charCount.innerHTML = 117 - prevWindow.innerHTML.length + " characters remaining";
var tweet = document.getElementById("tweet");
var done = document.getElementById("done");
var url = document.getElementById("url");
var urlTrim = document.getElementById("urlTrim");
var submit = document.getElementById("submit");

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
var company = getCookies(document.cookie).company.split("%20").join(" ");
var id = getCookies(document.cookie).id;


var tags = "";
for (var i = 0; i < results.length; i++) {
  for (var j = 0; j < description.length; j++) {
    if (results[i].id === description[j]) {
      results[i].style.backgroundColor = "rgb(255, 255, 153)";
      results[i].style.color = "black";
    }
  }
  results[i].onclick = function() {
    if (prevWindow.value.length + this.id.length > 117) {
      console.log(this.id.length);
      this.onclick = function() { return false; };
      prevWindow.innerHTML = prevWindow.value;
    } else {
      prevWindow.value += " #" + this.id;
      prevWindow.innerHTML = prevWindow.value;
      charCount.innerHTML = 117 - prevWindow.value.length + " characters remaining";
      tags += this.id + ",";
      this.style.backgroundColor = "silver";
      if (prevWindow.value.length >= 128) {
        charCount.style.color = "red";
        console.log(charCount);
      } else {
        charCount.style.color = "black";
      }
    }
  };
}

prevWindow.onkeyup = function () {
  charCount.innerHTML = 117 - this.value.length + " characters remaining";
  tweet.setAttribute("data-text", prevWindow.value);
  if (this.value.length >= 107) {
    charCount.style.color = "red";
    console.log(charCount);
  } else {
    charCount.style.color = "black";
  }
};

done.onclick = function () {
  var container = document.getElementById("container");
  var foo = document.getElementById("foo");
  var tweet = document.createElement("div");
  var startOver = document.createElement("a");
  startOver.setAttribute("id", "startOver");
  startOver.href = "/create";
  startOver.innerHTML = "Start Over";
  tweet.setAttribute("class", "tweet");
  tweet.innerHTML = company + " @" + id + "\n" + prevWindow.value + " " + url.value;
  container.appendChild(tweet);
  foo.appendChild(startOver);

  twttr.widgets.createShareButton(
    url.value,
    document.getElementById('container'),
    {
      text: prevWindow.value
    }
  );
  prevWindow.style.color = "rgb(102, 117, 127)";
  prevWindow.style.backgroundColor = "rgb(225, 232, 237)";
  charCount.style.visibility = "hidden";
  urlTrim.style.visibility = "hidden";
  done.style.visibility = "hidden";
  submit.value = "Start over with this article";
  document.cookie = "brand=" + tags;
};
