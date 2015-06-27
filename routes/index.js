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

// post to signup page
router.post('/signup', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var confirm = req.body.confirm;
  var hash = bcrypt.hashSync(req.body.password, 10);

  userCollection.findOne({user: email}, function(err, record) {
    var errorsList = lib.errorGen(email, password, confirm);
    if (record !== null) {
      var emailErr = "That email is already taken.";
      errorsList.push(emailErr);
    }
    if (errorsList.length !== 0) {
      res.render('index', {errors: errorsList, email: email});
    } else {
      res.cookie('user_name', email);
      userCollection.insert({user: email, password: hash});
      res.redirect('/create');
    }
  });
});

// log into existing account
router.post('/login', function(req, res, next) {
  var emailEx = req.body.emailEx;
  var passwordEx = req.body.passwordEx;
  userCollection.findOne({user: emailEx}, function (err, record) {
    if (record === null) {
      res.render('index', {emailEx: emailEx, msg: "That email doesn't match our records. Please try again."});
    } else {
      if (bcrypt.compareSync(passwordEx, record.password)) {
        res.cookie('user_name', emailEx);
        res.redirect('/create');
      } else {
        res.render('index', {msg: "Oops! Your password didn't match. Please try again.", emailEx: emailEx});
      }
    }
  });
});

module.exports = router;
