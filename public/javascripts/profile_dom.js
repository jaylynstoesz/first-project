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
var brand = getCookies(document.cookie).brand.split(",");
var container = document.getElementById("brand");
var list = [];
var foo = "";


// console.log(brand);
var form = document.getElementById("brandUpdate");

for (var i = 0; i < brand.length; i++) {
  var word = document.createElement("div");
  word.setAttribute("class", "hashtag");
  word.setAttribute("id", brand[i]);
  word.innerHTML = brand[i];
  container.appendChild(word);
  word.onclick = function() {
    this.style.visibility = "hidden";
    list.push(this.id);
    var input = document.createElement("input");
    input.type = "text";
    input.name = "brand";
    input.id = this.id;
    input.value = this.id;
    form.appendChild(input);
    container.removeChild(this);
  };
}
