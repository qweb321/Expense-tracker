const express = require("express");
const router = express.Router();
const passport = require("passport");
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

  if (password !== confirmPassword) {
    console.log("password and confirmPassword is different");
    return res.render("register", { name, email, password });
  }
  return User.findOne({ email }).then((user) => {
    if (user) {
      console.log("Email already registered");
      return res.redirect("/users/login");
    } else {
      User.create({
        name,
        email,
        password,
      });
      return res.redirect("/users/login");
    }
  });
});

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/users/login");
  });
});

module.exports = router;
