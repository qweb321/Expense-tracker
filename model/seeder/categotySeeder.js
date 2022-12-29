const Category = require("../category");
const db = require("../../config/mongoose");

const CATEGORY = {
  家居物業: "https://fontawesome.com/icons/home?style=solid",
  交通出行: "https://fontawesome.com/icons/shuttle-van?style=solid",
  休閒娛樂: "https://fontawesome.com/icons/grin-beam?style=solid",
  餐飲食品: "https://fontawesome.com/icons/utensils?style=solid",
  其他: "https://fontawesome.com/icons/pen?style=solid",
};

db.once("open", (req, res) => {
  for (key in CATEGORY) {
    Category.create({ name: key, iconUrl: CATEGORY[key] });
  }
  console.log("done");
});
