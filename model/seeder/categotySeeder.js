const Category = require("../category");
const db = require("../../config/mongoose");

const CATEGORIES = [
  { name: "家居物業", iconUrl: "fa-solid fa-house" },
  { name: "交通出行", iconUrl: "fa-solid fa-van-shuttle" },
  { name: "休閒娛樂", iconUrl: "fa-solid fa-face-grin-beam" },
  { name: "餐飲食品", iconUrl: "fa-solid fa-utensils" },
  { name: "其他", iconUrl: "fa-solid fa-pen" },
];

db.once("open", (req, res) => {
  Category.insertMany(CATEGORIES)
    .then(() => {
      console.log("done!");
      process.exit();
    })
    .catch((err) => console.log(err));
});
