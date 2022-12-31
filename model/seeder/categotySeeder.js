const Category = require("../category");
const db = require("../../config/mongoose");

const CATEGORY = {
  家居物業: "fa-solid fa-house",
  交通出行: "fa-solid fa-van-shuttle",
  休閒娛樂: "fa-solid fa-face-grin-beam",
  餐飲食品: "fa-solid fa-utensils",
  其他: "fa-solid fa-pen",
};

db.once("open", (req, res) => {
  for (key in CATEGORY) {
    Category.create({ name: key, iconUrl: CATEGORY[key] });
  }
  console.log("done");
});
