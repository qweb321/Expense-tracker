const db = require("../../config/mongoose");
const User = require("../user");

const USER = {
  name: "user1",
  email: "user1@example.com",
  password: "1234567",
};

db.once("open", (req, res) => {
  User.create({
    name: USER.name,
    email: USER.email,
    password: USER.password,
  });
  console.log("done");
});
