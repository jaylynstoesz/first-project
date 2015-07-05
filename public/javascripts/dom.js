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
charCount.innerHTML = 138 - prevWindow.innerHTML.length + " characters remaining";
var tweet = document.getElementById("tweet");
var done = document.getElementById("done");
var url = document.getElementById("url");

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
      tweet.setAttribute("data-text", prevWindow.value);
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
  console.log(tags);
  };
}

prevWindow.onkeyup = function () {
  charCount.innerHTML = 138 - this.value.length + " characters remaining";
  tweet.setAttribute("data-text", prevWindow.value);
  if (this.value.length >= 128) {
    charCount.style.color = "red";
    console.log(charCount);
  } else {
    charCount.style.color = "black";
  }
};

done.onclick = function () {
  var container = document.getElementById("container");
  var newDiv = document.createElement("div");
  newDiv.innerHTML = prevWindow.value + " " + url.value;
  container.appendChild(newDiv);

  twttr.widgets.createShareButton(
    url.value,
    document.getElementById('container'),
    {
      text: prevWindow.value,
      // href: url.value
    }
  );
};
