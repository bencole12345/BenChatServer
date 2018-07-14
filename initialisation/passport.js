const passport = require('passport'),
      LocalStrategy = require('passport-local'),
      User = require('../models/user');

const localOptions = {
    usernameField: 'username'
};

const AUTHENTICATION_FAILED_RESPONSE = "Your login details could not be verified.";

passport.use(new LocalStrategy(localOptions, function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
        if (err) return done(err);
        if (!user) return done(null, false, { error: AUTHENTICATION_FAILED_RESPONSE });
        user.comparePassword(password, function(err, isMatch) {
            if (err) return done(err);
            if (!isMatch) return done(null, false, { error: AUTHENTICATION_FAILED_RESPONSE });
            return done(null, user);
        });
    });
}));
