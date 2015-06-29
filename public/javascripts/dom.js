var results = document.getElementById("results").childNodes;
var prevWindow = document.getElementById("prevWindow");
var charCount = document.getElementById("charCount");
charCount.innerHTML = prevWindow.innerHTML.length;

for (var i = 0; i < results.length; i++) {
  results[i].onclick = function() {
    prevWindow.value += "#" + this.id + " ";
    prevWindow.innerHTML = prevWindow.value;
    charCount.innerHTML = prevWindow.value.length;
  };
}

prevWindow.onkeyup = function () {
  console.log(prevWindow.value);
  charCount.innerHTML = this.value.length;
};
