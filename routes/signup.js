var express = require('express');
var router = express.Router();
var passport = require('passport');


router.get('/', function(req, res, next) {
  if (req.user) {
    res.send('You are already logged in!');
  } else {
    let email = req.session.signupEmail;
    let password = req.session.signupPassword;
    let profile_name = req.session.signupProfileName;
    delete req.session.signupEmail;
    delete req.session.signupPassword;
    delete req.session.signupProfileName;
    res.render('signup', {
      message: req.flash('signupMessage'),
      email: email,
      password: password,
      profile_name: profile_name });
  }
});

router.post('/', (req, res) => {
  req.session.signupEmail = req.body.email;
  req.session.signupProfileName = req.body.profile_name;
  req.session.signupPassword = req.body.password;
  (passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true,
  }))(req, res);
})


module.exports = router;