var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var lib = require('../lib/lib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Twitter Project' });
});

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

// post to signup page
router.post('/signup', function(req, res, next) {
  var handle = req.body.handle;
  var password = req.body.password;
  var confirm = req.body.confirm;
  var hash = bcrypt.hashSync(req.body.password, 10);

  userCollection.findOne({user: handle}, function(err, record) {
    var errorsList = lib.errorGen(handle, password, confirm);
    if (record !== null) {
      var handleErr = "That handle is already taken.";
      errorsList.push(handleErr);
    }
    if (errorsList.length !== 0) {
      res.render('index', {errors: errorsList, handle: handle});
    } else {
      res.cookie('id', handle);
      userCollection.insert({user: handle, password: hash});
      res.redirect('/create');
    }
  });
});

// log into existing account
router.post('/login', function(req, res, next) {
  var handleEx = req.body.handleEx;
  var passwordEx = req.body.passwordEx;
  userCollection.findOne({user: handleEx}, function (err, record) {
    if (record === null) {
      res.render('index', {handleEx: handleEx, msg: "That Twitter handle doesn't match our records. Please try again."});
    } else {
      if (bcrypt.compareSync(passwordEx, record.password)) {
        res.cookie('id', handleEx);
        res.cookie('company', record.company);
        res.cookie('description', record.description);
        res.redirect('/create');
      } else {
        res.render('index', {msg: "Oops! Your password didn't match. Please try again.", handleEx: handleEx});
      }
    }
  });
});

module.exports = router;
