// Require -
const express = require("express");
const mysql = require("mysql2");
const exphbs = require("express-handlebars");
require("dotenv").config();

const app = express();

const port = process.env.PORT || 8080;

// Middleware - (express).
app.use(express.urlencoded({ extended: true }));

// Parse application/json -
app.use(express.json());

// Static Files - (js, css).
app.use(express.static("public"));

// Templating engine - (handlebars).
const handlebars = exphbs.create({ extname: ".hbs" });
app.engine(".hbs", handlebars.engine);
app.set("view engine", ".hbs");

// Connection Pool
const connection = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
});

//Connect to DB (Pulling)-
connection.getConnection((err, connection) => {
  if (err) throw err; // Not Connected
  console.log("Connected as ID " + connection.threadId);
});

// Routes - (which is imported from user.js)
const routes = require("./server/routes/user");
app.use("/", routes);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
