var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
var page = require('../lib/page');

/* GET Create page. */
router.get('/create', function(req, res, next) {
  res.render('create/index');
});

// Log out
router.get('/logout', function(req, res, next) {
  res.clearCookie('user_name');
  res.render('create/logout');
});

// Post key words
router.post('/create', function(req, res, next) {
  var article = req.body.article;
  var url = req.body.url;
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      // (lib.getKeywords(window.$("p").text()));
      res.render('create/index', {article: article, suggestions: (lib.getKeywords(window.$("p").text()))});
    }
  );
});



module.exports = router;
