var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
// var dom = require('../public/javascripts/dom');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var bcrypt = require('bcryptjs');


/* GET Create page. */
router.get('/create', function(req, res, next) {
  var company = req.cookies.company;
  if (!company) {
    res.render('create/index');
  } else {
    res.render('create/index', {company: company});
  }
});

// Log out
router.get('/logout', function(req, res, next) {
  res.clearCookie('id');
  res.clearCookie('company');
  res.clearCookie('description');
  res.render('create/logout');
});

// Post key words
router.post('/create', function(req, res, next) {
  var article = req.body.article;
  var url = req.body.url;
  var urlTrim = url.substring(0, 30) + "...";
  var company = req.cookies.company;

  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      res.render('create/index', {article: article, suggestions: (lib.getKeywords(window.$("p").text())), url: url, urlTrim: urlTrim, company: company, title: window.$("title").text()});
    }
  );
});


module.exports = router;
