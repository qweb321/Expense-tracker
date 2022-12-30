const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  const errors = [];

  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: "All fields are required." });
  }
  if (password !== confirmPassword) {
    errors.push({ message: "Password and confirmPassword is different." });
  }
  if (errors.length) {
    console.log(errors);
    return res.render("register", {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  }
  User.findOne({ email }).then((user) => {
    if (user) {
      errors.push({ message: "Email already exists." });
      return res.render("register", {
        errors,
        name,
        email,
        password,
        confirmPassword,
      });
    }
    return bcrypt
      .genSalt(10)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => {
        User.create({
          name,
          email,
          password: hash,
        });
      })
      .then(() => {
        res.redirect("/users/login");
      })
      .catch((err) => console.log(err));
  });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Logout Successfully");
    res.redirect("/users/login");
  });
});

module.exports = router;
