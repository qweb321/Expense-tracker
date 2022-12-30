const db = require("../../config/mongoose");
const User = require("../user");
const bcrypt = require("bcryptjs");

const USER = {
  name: "user1",
  email: "user1@example.com",
  password: "1234567",
};

db.once("open", (req, res) => {
  bcrypt
    .genSalt(10)
    .then((salt) => bcrypt.hash(USER.password, salt))
    .then((hash) => {
      User.create({
        name: USER.name,
        email: USER.email,
        password: hash,
      });
      console.log("done");
    });
});
