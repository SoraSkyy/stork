var express = require('express');
var router = express.Router();
var User = require('../models/user');
var passport = require('passport');


router.get('/', function(req, res, next) {
  if (req.user) {
    res.send('You are already logged in!');
  } else {
    res.render('signup', { message: req.flash('signupMessage') });
  }
});

router.post('/', passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true,
  })
);

module.exports = router;