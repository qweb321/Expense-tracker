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
  const userId = req.user._id;
  const { name, date, category, amount } = req.body
 
  if (amount < 0 ) {
    req.flash('warning_msg', "Amount can not less than zero")
    return res.redirect('back')
  } 
  if (isNaN(amount)) {
    req.flash('warning_msg', "Amount only can enter number")
    return res.redirect('back')
  }
 
  return Expense.create({
    name,
    date,
    category,
    amount: Math.ceil(amount),
    userId,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

router.get("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;

  Category.find()
    .lean()
    .then((categories) => {
      Expense.findOne({ _id, userId })
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

router.put("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  const { name, date, category, amount } = req.body;
  if (amount < 0 ) {
    req.flash('warning_msg', "Amount can not less than zero")
    return res.redirect('back')
  } 
  if(isNaN(amount)) {
    req.flash('warning_msg', "Amount only can enter number")
    return res.redirect('back')
  }

  return Expense.findOne({ _id, userId })
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

router.delete("/:id", (req, res) => {
  const userId = req.user._id;
  const _id = req.params.id;
  Expense.findOneAndDelete({ _id, userId })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

module.exports = router;
