const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/', (req, res, next) => {
  if (req.user) {
    res.send('You are already logged in!');
  } else {
    res.render('login', { message: req.flash('loginMessage')});
  }
});

router.post('/', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  })
);

module.exports = router;