// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const widgetsRoutes = require("./routes/widgets");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/new-quiz", (req, res) => {
  res.render("new-quiz")
})

//currently not adding dynamically for different users
app.post("/add-quiz", (req, res) => {
  console.log("recieved new quiz title: ", req.body.title);

  const values = [req.body.id, req.body.title];

  return db.query(`INSERT
  INTO quizzes (id, owner_id, name)
  VALUES ($1, 10002, $2)
  RETURNING *;
  `,values)
  .then((result)=> {
     console.log("new quiz ... ",result.rows[0]);
     res.render("index");
  })
  .catch(err => console.log(err.msg))
  

})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
