const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
// LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const User = require('./../models/user');

const localStrategy = new LocalStrategy((username, password, done) => {
  let user;
  User
    .findOne({ username })
    .then(results => {
      user = results;
      if (!user) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect username',
          location: 'username'
        });
      }
      console.log(password);
      
      const isValid = user.validatePassword(password);
      if (!isValid) {
        return Promise.reject({
          reason: 'LoginError',
          message: 'Incorrect password',
          location: 'password'
        });
      }

      return done(null, user);

    }).catch(err => {
      if (err.reason === 'LoginError') {
        return done(null, false);
      }
      return done(err);
    });
});

passport.use(localStrategy);
// const localAuth = passport.authenticate('local', {session: false});

// review: being exported with passport in other files?
module.exports = localStrategy;