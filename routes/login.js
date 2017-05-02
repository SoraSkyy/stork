var express = require('express');
var router = express.Router();


router.get('/', function(req, res, next) {
	if (req.user) {
		res.send('You are already logged in!');
	} else {
		res.render('login');
	}
});

module.exports = router;