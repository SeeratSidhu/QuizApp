// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const { register, login } = require("./helpers/routes");
const app = express();

// PG database client/connection setup
const {Pool} = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  secret: "random string for now",
  maxAge: 60*10*1000 //10 minutes - testing purposes (will use 24*60*60*1000 afterwards)
}))

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
const addRoutes = require("./routes/create-quizzes")
const quizzesRoutes = require("./routes/quizzes");
const req = require("express/lib/request");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/api/quizzes", quizzesRoutes(db))
app.use("/create-quizzes", addRoutes(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/", (req, res) => {
//   res.render("index");
// });



app.get("/", (req, res) => {
  db.query(
    "SELECT id, name FROM quizzes;"
  )
    .then((result) => {
      res.render("index", {
        quizzes: result.rows
      });
    })
    .catch((err) => {
      console.log("homepage error:", err)
    })
});

app.get("/my-quizzes", (req, res) => {
  res.render("my-quizzes");
})



app.get("/login", (req, res) => {
  res.render("login");
});



app.get("/register", (req, res)=>{
  res.render("register");
});



app.post("/register", register)



app.post("/login", login);



app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});





