var results = document.getElementById("results").childNodes;
var preview = document.getElementById("prevWindow").innerHTML;
var prevWindow = document.getElementById("prevWindow");
for (var i = 0; i < results.length; i++) {
  results[i].addEventListener("click", function() {
    console.log(this.id);
    prevWindow.innerHTML += "#" + this.id + " ";
    console.log(preview);
  });
}
