const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Expense = require("./model/amount");

require("./config/mongoose");

const port = 3000;
const app = express();

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const categoryValue = req.query.category || {};
  const category = categoryValue ? { [categoryValue]: true } : {};
  Expense.aggregate([
    {
      $project: {
        name: 1,
        amount: 1,
        category: 1,
        formattedDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      },
    },
  ])
    .then((spendList) => {
      const selectList = spendList.filter((spend) => {
        return spend.category === categoryValue;
      });
      if (categoryValue.length) {
        spendList = selectList;
      }

      let totoalAmount = 0;
      spendList.forEach((spend) => {
        totoalAmount += spend.amount;
      });

      return res.render("index", { spendList, category, totoalAmount });
    })
    .catch((err) => console.log(err));
});

app.get("/new", (req, res) => {
  res.render("new");
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
  const id = req.params.id;
  Expense.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        name: 1,
        amount: 1,
        category: 1,
        formattedDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
      },
    },
  ])
    .then((spend) => {
      const categoryValue = spend[0].category;
      const category = categoryValue ? { [categoryValue]: true } : {};
      res.render("edit", { spend: spend[0], category });
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
