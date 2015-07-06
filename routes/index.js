var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var db = require('monk')(process.env.MONGOLAB_URI);
var userCollection = db.get('allUsers');
var lib = require('../lib/lib');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: "TweetHelper"});
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
      res.render('index', {errors: errorsList, handle: handle, title: "TweetHelper"});
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
      res.render('index', {handleEx: handleEx, msg: "That Twitter handle doesn't match our records. Please try again.", title: "TweetHelper"});
    } else {
      if (bcrypt.compareSync(passwordEx, record.password)) {
        res.cookie('id', handleEx);
        res.cookie('company', record.company);
        res.cookie('description', record.description);
        res.redirect('/create');
      } else {
        res.render('index', {msg: "Oops! Your password didn't match. Please try again.", handleEx: handleEx, title: "TweetHelper"});
      }
    }
  });
});

// show profile page
router.get('/profile', function(req, res, next) {
  var id = req.cookies.id;
  var company = req.cookies.company;
  var description = req.cookies.description;
  userCollection.findOne({user: id}, function(err, record) {
    var answer = record.answer;
    res.render('create/profile', {id: id, company: company, description: description, answer: answer, title: "TweetHelper"});
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
  userCollection.update({user: id}, {$set: {description: description, company: company}});
  res.redirect('/profile');
});

// update brand
router.post('/brand', function(req, res, next) {
  var form = req.body.brand;
  var id = req.cookies.id;
  var brandList = [];
  for (var i = 1; i < form.length; i++) {
    var word = form[i];
    brandList.push(word);
  }
  userCollection.findOne({user: id}, function(err, record) {
    var things = record.brand;
    for (var i = 0; i < things.length; i++) {
      var word = things[i];
      brandList.push(word);
    }
    userCollection.update({user: id}, {$set: {brand: brandList}});
    res.clearCookie("brand");
    res.redirect('/profile');
  });
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
        res.render('create/profile', {errors: errorsList, id: id, company: company, description: description, answer: answer, title: "TweetHelper"});
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
        res.render('create/profile', {errors: errorsList, id: id, company: company, description: description, answer: answer, title: "TweetHelper"});
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
