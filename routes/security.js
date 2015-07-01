var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var bcrypt = require('bcryptjs');


// view security question
router.get('/forgot', function(req, res, next) {
  res.render('forgot');
});

// answer security question
router.post('/forgot', function(req, res, next) {
  var handle = req.body.handle;
  var answer = req.body.answer;
  userCollection.findOne({user: handle}, function(err, record) {
    if (answer !== record.answer) {
      res.render('forgot', {msg: "That is not the correct answer. Please try again."});
    } else {
      res.cookie("id", handle);
      res.cookie('company', record.company);
      res.cookie('description', record.description);
      res.redirect('/reset');
    }
  });
});

// view password reset page
router.get('/reset', function(req, res, next) {
  res.render('reset');
});

// reset password and redirect to dashboard
router.post('/reset', function(req, res, next) {
  var id = req.cookies.id;
  if (req.body.password.length < 8) {
    res.render('reset', {msg: "Password must be at least 8 characters."});
  } else {
    var hash = bcrypt.hashSync(req.body.password, 10);
    userCollection.update({user: id}, {$set: {user: id, password: hash}});
    res.redirect('/create');
  }
});

module.exports = router;
