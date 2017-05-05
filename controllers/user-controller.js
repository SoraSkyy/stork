const User = require('../models/user');

class UserController {
  /*
    Controller class for the User model.
    Handles validation of inputs for login/signup
  */
  constructor() { }

  /*
    This method is called primarily by passport-auth.js when a user sends a POST
    request to sign up to the site.

    It first checks to see if the email or the profile name has been taken, and then
    does the appropriate actions.

    @param {Object} req - The request object that passport receives from the POST request.
    @param {String} email - The email that is being input by the user.
    @param {String} password - The password that is being input by the user.
    @param {requestCallback} done - The callback that returns the control flow back to passport.
  */
  static createUser(req, email, password, done) {
    /* 
      Start by validating email, profile_name and password formats.
      Email is checked using the validator itself.
      Passwords need to be between 6 and 24 characters long without spaces.
      Profile names must be between 4 and 20 characters long, alphanumeric only.
    */

    req.checkBody('email', 'Invalid email.').isEmail();
    req.checkBody('profile_name', 'Profile name must be between 4 to 20 characters.').len(4,20);
    req.checkBody('profile_name', 'Profile name can only contain letters and numbers.').isAlphanumeric();
    req.checkBody('password', 'Password length must be between 6 to 24 characters.').len(6,24);
    req.checkBody('password', 'Password cannot contain spaces.').noSpaces();

    req.getValidationResult().then((result) => {
      if (!result.isEmpty()) {
        return done(null, false, req.flash('signupMessage', result.array()[0].msg));
      }
      /* 
        Now check if the email or profile_name already exists.
        As long as either one of them gives a match, then we reject the application and flash 
        error message.
      */
      User.findOne({ $or: [{ 'email': email }, { 'profile_name': req.body.profile_name }] }, (err, user) => {
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
            return done(null, false, req.flash('signupMessage', 'This profile name has already been taken.'));
          }
        } else {
          // All checks cleared. Time to create his profile and add it into the DB.
          let newUser = new User();
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
    });
  }

  /*
    This method is called primarily by passport-auth.js when a user sends a POST
    request to log in to the site.

    It checks if there is a user with the email, and then compares the hashed password
    with the one that was entered.

    @param {String} email - The email that is being input by the user.
    @param {String} password - The password that is being input by the user.
    @param {requestCallback} done - The callback that returns the control flow back to passport.
  */
  static loginUser(req, email, password, done) {
    const failureMessage = 'Error: Either email or password is wrong.';
    User.findOne({ 'email': email }, (err, user) => {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, req.flash('loginMessage', failureMessage));
      }
      user.validatePassword(password, user.password, (result) => {
        result ? done(null, user) : done(null, false, req.flash('loginMessage', failureMessage));
      });
    });
  }

}








module.exports = UserController;