const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const routes = require("./routes");
const usePassport = require("./config/passport");

require("./config/mongoose");

const port = 3000;
const app = express();

app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: "hbs" }));
app.set("view engine", "hbs");

app.use(
  session({
    secret: "Thisismysecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

usePassport(app);
app.use(routes);

app.listen(port, () => {
  console.log(`app is running on http://localhost:${port}/users/login`);
});
