const passport = require("passport");
const LocalStrategy = require("passport-local");
const FacebookStrategy = require("passport-facebook");
const bcrypt = require("bcryptjs");
const User = require("../model/user");

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passReqToCallback: true },
      function (req, email, password, done) {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(
                null,
                false,
                req.flash("warning_msg", "Email is not registered")
              );
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(
                  null,
                  false,
                  req.flash("warning_msg", "Email or Password is not correct")
                );
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );

  // facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.FACEBOOK_APP_URL,
        profileFields: ["email", "displayName"],
      },
      function (accessToken, refreshToken, profile, done) {
        const { name, email } = profile._json;

        User.findOne({ email }).then((user) => {
          if (user) {
            return done(null, user);
          }
          const randomPassword = Math.random().toString(36).slice(-8);

          bcrypt
            .genSalt(10)
            .then((salt) => {
              bcrypt.hash(randomPassword, salt);
            })
            .then((hash) => {
              User.create({
                name,
                email,
                password: hash,
              });
            })
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
      }
    )
  );

  //sessions
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
