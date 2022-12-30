const express = require("express");
const router = express.Router();
const Category = require("../../model/category");
const Expense = require("../../model/amount");
const dayjs = require("dayjs");

router.get("/", (req, res) => {
  const reqcategory = req.query.category || {};
  const userId = req.user._id;
  let totalAmount = 0;

  Category.find()
    .lean()
    .then((categories) => {
      // if selected or not
      categories.forEach((category) => {
        if (category._id.toString() === reqcategory) {
          category.selected = true;
        }
      });

      Expense.find({ userId })
        .lean()
        .populate("category")
        .then((spendList) => {
          const selectList = spendList.filter((spend) => {
            return spend.category._id.toString() === reqcategory;
          });

          if (reqcategory.length) {
            spendList = selectList;
          }

          spendList.forEach((spend) => {
            spend.date = dayjs(spend.date).format("YYYY/MM/DD");
            totalAmount += spend.amount;
          });
          res.render("index", { categories, spendList, totalAmount });
        });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
