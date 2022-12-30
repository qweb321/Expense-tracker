const express = require("express");
const router = express.Router();
const User = require("../../model/user");

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }).then((user) => {
    if (!user) {
      console.log("email is not registered");
      return res.redirect("/users/login");
    } else {
      if (user.password === password) {
        return res.redirect("/");
      } else {
        return res.redirect("/users/login");
      }
    }
  });
});

module.exports = router;
