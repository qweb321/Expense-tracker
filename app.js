const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const Expense = require("./model/amount");

require("./config/mongoose");

const port = 3000;
const app = express();

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
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
      console.log(spendList);
      return res.render("index", { spendList });
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
    converDate: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
    category,
    amount,
  })
    .then(() => res.redirect("/"))
    .catch((err) => console.log(err));
});

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}`);
});
