var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
// var dom = require('../public/javascripts/dom');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var bcrypt = require('bcryptjs');
var unirest = require('unirest');
var token = process.env.THESAURUS_TOKEN;

/* GET Create page. */
router.get('/create', function(req, res, next) {
  var company = req.cookies.company;
  var id = req.cookies.id;
  if (!company) {
    res.render('create/index', {title: "TweetHelper"});
  } else {
    res.render('create/index', {company: company, id: id, title: "TweetHelper"});
  }
});

// Log out
router.get('/logout', function(req, res, next) {
  res.clearCookie('id');
  res.clearCookie('company');
  res.clearCookie('description');
  res.render('create/logout', {title: "TweetHelper"});
});

// Post key words
router.post('/create', function(req, res, next) {
  var article = req.body.article;
  var id = req.cookies.id;
  var url = req.body.url;
  var urlTrim = url.substring(0, 30) + "...";
  var company = req.cookies.company;

  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      res.render('create/index', {article: article, suggestions: (lib.getKeywords(window.$("p").text())), url: url, urlTrim: urlTrim, company: company, id: id, title: "TweetHelper", articleTitle: window.$("title").text()});
    }
  );
});

router.get('/browse', function(req, res, next) {
  var description = req.cookies.description.split("%2C")[0].split(",");
    // unirest.get('http://words.bighugelabs.com/api/2/' + token + "/" + description[i] + "/json")
    //   .end(function (response) {
    //   });
  res.render('create/browse', {title: "TweetHelper"});
});



module.exports = router;
