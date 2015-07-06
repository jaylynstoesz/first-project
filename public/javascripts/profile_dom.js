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

var bcookie = getCookies(document.cookie).brand;
var brand = getCookies(document.cookie).brand.split(",");
var company = getCookies(document.cookie).company.split("%20").join(" ");
var description = getCookies(document.cookie).description.split("%2C");
var id = getCookies(document.cookie).id;
var brandSubmit = document.getElementById("brandSubmit");
var container = document.getElementById("container");
var form = document.getElementById("brandUpdate");
if (!bcookie) {
  brandSubmit.disabled = "true";
  container.innerHTML = "Looks like you don't have any recent tags! Post an article to add tags to your brand profile.";
}

var list = [];
for (var i = 0; i < brand.length; i++) {
  if (brand[i] !== "") {
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
      input.setAttribute("class", "hashtag");
      form.appendChild(input);
      container.removeChild(this);
    };
  }
}
