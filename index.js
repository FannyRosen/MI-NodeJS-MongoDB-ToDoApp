const express = require("express");
const exphbs = require("express-handlebars");
const todosRouter = require("./routers/todos-route");

require("dotenv").config();

const app = express();
app.use(express.json());

app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
  })
);

app.set("view engine", "hbs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/todos", todosRouter);

app.listen(3000, () => {
  console.log("http://localhost:3000/");
});
