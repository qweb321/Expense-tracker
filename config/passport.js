const passport = require("passport");
const LocalStrategy = require("passport-local");
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
            } else {
              if (user.password !== password) {
                return done(
                  null,
                  false,
                  req.flash("warning_msg", "Email or Password is not correct")
                );
              } else {
                return done(null, user);
              }
            }
          })
          .catch((err) => done(err, false));
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
