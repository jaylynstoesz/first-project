var express = require('express');
var router = express.Router();
var lib = require('../lib/lib');
var jsdom = require('jsdom');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var bcrypt = require('bcryptjs');


// view security question
router.get('/forgot', function(req, res, next) {
  res.render('forgot', {title: "TweetHelper"});
});

// answer security question
router.post('/forgot', function(req, res, next) {
  var handle = req.body.handle.trim();
  var answer = req.body.answer;
  if (!handle) {
    res.render('forgot', {msg: "Please enter your Twitter handle.", title: "TweetHelper"});
  }
  if (!answer) {
    res.render('forgot', {msg: "Please answer the security question.", handle: handle, title: "TweetHelper"});
  } else {
    userCollection.findOne({user: handle}, function(err, record) {
      if (!record || !record.answer) {
        res.render('forgot', {msg: "A security question has not been set up for this account.", title: "TweetHelper"});
      } else if (answer !== record.answer) {
        res.render('forgot', {msg: "That is not the correct answer. Please try again.", handle: handle, title: "TweetHelper"});
      } else {
        res.cookie("id", handle);
        res.cookie('company', record.company);
        res.cookie('description', record.description);
        res.redirect('/reset');
      }
    });
  }
});

// view password reset page
router.get('/reset', function(req, res, next) {
  res.render('reset', {title: "TweetHelper"});
});

// reset password and redirect to dashboard
router.post('/reset', function(req, res, next) {
  var id = req.cookies.id;
  if (req.body.password.length < 8) {
    res.render('reset', {msg: "Password must be at least 8 characters.", title: "TweetHelper"});
  } else {
    var hash = bcrypt.hashSync(req.body.password, 10);
    userCollection.update({user: id}, {$set: {user: id, password: hash}});
    res.redirect('/create');
  }
});

router.get('/delete', function(req, res, next) {
  var id = req.cookies.id;
  userCollection.remove({user: id});
});

module.exports = router;
