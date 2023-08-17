require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + "/public"));
app.use("/api", require("./api.js"));
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
