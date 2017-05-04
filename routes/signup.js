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

/*
router.post('/', (req, res) => {
  req.checkBody('email', 'Invalid email.').isEmail();
  req.checkBody('profile_name', 'Profile name must be between 4 to 20 characters.').len(4,20);
  req.checkBody('profile_name', 'Profile name can only contain letters and numbers.').isAlphanumeric();
  req.checkBody('password', 'Password length must be between 6 to 20 characters.').len(6,20);

  req.getValidationResult().then((result) => {
    result.isEmpty() ? (passport.authenticate('local-signup', {
  successRedirect: '/login',
  failureRedirect: '/signup',
  failureFlash: true,
  }))(req, res) : res.render('signup', {
    'profile_name':req.body.profile_name,
    'password':req.body.password,
    'email':req.body.email,
    message: req.flash('signupMessage')});
  });

});
*/

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