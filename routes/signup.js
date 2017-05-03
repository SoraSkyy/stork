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


/*
router.post('/', function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var profile_name = req.body.profile_name;
	var newUser = new User({
		email: email,
		profile_name : profile_name,
		password: password });
	newUser.save(newUser,function(err, user) {

		if (err) {
			console.log("error has occured");
			console.log(err);
			res.redirect('signup');
		} else {
			res.redirect('login');
		}
	});
});
*/


module.exports = router;