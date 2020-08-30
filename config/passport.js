const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({ email }, (findErr, user) => {
        if (findErr) return console.log(findErr);
        if (!user)
          return done(null, false, {
            message: 'Account with that email does not exist',
          });
        user.authenticatePass(password, (authErr, isMatch) => {
          if (authErr) throw new Error(authErr);
          if (!isMatch) return done(null, false, { message: 'Incorect password' });
          return done(null, user);
        });
      });
    }),
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });
  passport.deserializeUser(function (id, done) {
    User.findById(id, (findErr, user) => {
      done(findErr, user);
    });
  });
};
