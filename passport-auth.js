

// Passport-related initialization.
const UserController = require('./controllers/user-controller');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Enable serializing/deserializing of authenticated sessions.
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// Register local-signup strategy.
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true }, UserController.createUser));

// Register local-login strategy.
passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true }, UserController.loginUser));

module.exports = passport;


