const express = require("express");
const router = express.Router();
const Category = require("../../model/category");
const Expense = require("../../model/amount");
const dayjs = require("dayjs");

router.get("/new", (req, res) => {
  Category.find()
    .lean()
    .then((cateList) => {
      res.render("new", { cateList });
    });
});

router.post("/new", (req, res) => {
  const { name, date, category, amount } = req.body;
  return Expense.create({
    name,
    date,
    category,
    amount,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res) => {
  const _id = req.params.id;

  Category.find()
    .lean()
    .then((categories) => {
      Expense.findOne({ _id })
        .lean()
        .then((spend) => {
          spend.date = dayjs(spend.date).format("YYYY-MM-DD");

          categories.forEach((ca) => {
            if (ca._id.toString() === spend.category.toString()) {
              ca.selected = true;
            }
          });

          res.render("edit", { categories, spend });
        });
    })

    .catch((err) => console.log(err));
});

router.post("/:id", (req, res) => {
  const id = req.params.id;
  const { name, date, category, amount } = req.body;
  return Expense.findOne({ id })
    .then((spend) => {
      spend.name = name;
      spend.date = date;
      spend.category = category;
      spend.amount = amount;
      return spend.save();
    })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

router.post("/:id/delete", (req, res) => {
  const id = req.params.id;
  Expense.findOneAndDelete({ id })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
