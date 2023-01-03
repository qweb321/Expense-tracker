const db = require("../../config/mongoose");
const User = require("../user");
const bcrypt = require("bcryptjs");

const USER = [
  {
    name: "user1",
    email: "user1@example.com",
    password: "1234567",
  },
];

db.once("open", (req, res) => {
  Promise.all(
    Array.from(USER).map((seed) => {
      return bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(seed.password, salt))
        .then((hash) => {
          return User.create({
            name: seed.name,
            email: seed.email,
            password: hash,
          });
        });
    })
  ).then(() => {
    console.log("done!");
    process.exit();
  });
});
