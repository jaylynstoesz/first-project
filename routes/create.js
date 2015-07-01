var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
var dom = require('../public/javascripts/dom');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var bcrypt = require('bcryptjs');


/* GET Create page. */
router.get('/create', function(req, res, next) {
  res.render('create/index');
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
  jsdom.env(
    url,
    ["http://code.jquery.com/jquery.js"],
    function (errors, window) {
      res.render('create/index', {article: article, suggestions: (lib.getKeywords(window.$("p").text())), url: url, urlTrim: urlTrim, title: window.$("title").text()});
    }
  );
});

// show profile page
router.get('/profile', function(req, res, next) {
  var id = req.cookies.id;
  var company = req.cookies.company;
  var description = req.cookies.description;
  userCollection.findOne({user: id}, function(err, record) {
    var answer = record.answer;
    res.render('create/profile', {id: id, company: company, description: description, answer: answer});
  });
});

// update profile details
router.post('/details', function(req, res, next) {
  var id = req.cookies.id;
  var description = req.body.description;
  var company = req.body.company;
  res.clearCookie("company");
  res.clearCookie("description");
  res.cookie("company", company);
  res.cookie("description", description);
  userCollection.update({user: id}, {$set: {description: description, company: company }});
  res.redirect('/profile');
});

// update login info
router.post('/update', function(req, res, next) {
  var handle = req.body.handle;
  var id = req.cookies.id;
  var description = req.cookies.description;
  var company = req.cookies.company;
  var password = req.body.password;
  var confirm = req.body.confirm;
  var hash = bcrypt.hashSync(req.body.password, 10);
  var answer = req.body.answer;

  if (handle !== id) {
    userCollection.findOne({user: handle}, function(err, record) {
      var errorsList = lib.errorGen(handle, password, confirm);
      if (record !== null) {
        var handleErr = "That handle is already taken.";
        errorsList.push(handleErr);
      }
      if (errorsList.length !== 0) {
        res.render('create/profile', {errors: errorsList, id: id, company: company, description: description, answer: answer});
      } else {
        userCollection.update({user: id}, {$set: {user: handle, password: hash, answer: answer}});
        res.clearCookie("id");
        res.cookie("id", handle);
        res.redirect('/profile');
      }
    });
  } else {
    userCollection.findOne({user: handle}, function(err, record) {
      var errorsList = lib.errorGen(handle, password, confirm);
      if (errorsList.length !== 0) {
        res.render('create/profile', {errors: errorsList, id: id, company: company, description: description, answer: answer});
      } else {
        userCollection.update({user: id}, {$set: {user: handle, password: hash, answer: answer}});
        res.clearCookie("id");
        res.cookie("id", handle);
        res.redirect('/profile');
      }
    });
  }
});

module.exports = router;
