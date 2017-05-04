

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

// Register local-signup strategy
passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true }, UserController.createUser));

// TODO: Register local login strategy. This is just a placeholder.
passport.use('local-login', new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, (username, password, done) => {
  User.findOne({ username }, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.validPassword(password)) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  });
}));

module.exports = passport;


