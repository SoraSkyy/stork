const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);
const mongoose = require('mongoose');
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost/storkapp');

// Passport-related initialization.
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
  passReqToCallback: true }, (req, email, password, done) => {
    /* 
      Checks if the email or profile_name already exists.
      As long as either one of them gives a match, then we reject the application and flash 
      error message.
    */
    User.findOne({ $or: [ { 'email': email }, { 'profile_name': req.body.profile_name } ] }, (err, user) => {
      if (err) {
        console.log(err);
        return done(err);
      }
      if (user) {
        /* 
          Means a match is found and that this application should not be accepted.
          Attempt to find out what exactly which is the problem.
        */
        if (user.email.toString().localeCompare(email) == 0) {
          // No repeat emails allowed in app.
          return done(null, false, req.flash('signupMessage', 'That email is already in use.'));
        } else if (user.profile_name.toString().localeCompare(req.body.profile_name) == 0) {
          // The profile name should also be unique.
          return done(null, fasle, req.flash('signupMessage', 'This profile name has already been taken.'));
        }
      } else {
        // All checks cleared. Time to create his profile and add it into the DB.
        newUser = new User();
        newUser.profile_name = req.body.profile_name;
        newUser.email = email;
        newUser.generateHash(password, (hash) => {
          newUser.password = hash;
          newUser.save((err) => {
            if (err) {
              console.log('There was an error in creating the user');
              console.log(err);
              throw err;
            } else {
              done(null, newUser);
            }
          });
        });
      }
    });
  }));

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

const index = require('./routes/index');
const users = require('./routes/users');
const login = require('./routes/login');
const signup = require('./routes/signup');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
  secret: 'test', // TODO: Store secret outside of source code.
  store: new MongoStore({
    host: '127.0.0.1',
    port: '27017',
    url: 'mongodb://localhost:27017/storkapp',
  }),
  saveUninitialized: false,
  resave: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/', index);
app.use('/users', users);
app.use('/login', login);
app.use('/signup', signup);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
