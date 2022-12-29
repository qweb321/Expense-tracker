const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Expense = require("./model/amount");
const Category = require("./model/category");

require("./config/mongoose");

const port = 3000;
const app = express();

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const reqcategory = req.query.category || {};

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

      Expense.find()
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

app.get("/new", (req, res) => {
  Category.find()
    .lean()
    .then((cateList) => {
      res.render("new", { cateList });
    });
});

app.post("/new", (req, res) => {
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

app.get("/:id", (req, res) => {
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

app.post("/:id", (req, res) => {
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

app.post("/:id/delete", (req, res) => {
  const id = req.params.id;
  Expense.findOneAndDelete({ id })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
