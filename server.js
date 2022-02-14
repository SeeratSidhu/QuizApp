// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require('cookie-session');
const { generateRandomInteger } = require("./helpers/create-random-integer"); 
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
  secret: "random key for now",
  maxAge: 60*2*1000 //two minutes - testing purposes (will use 24*60*60*1000 afterwards)
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



app.get("/login", (req, res) => {
  res.render("login");
});



app.get("/register", (req, res)=>{
  res.render("register");
});



//checks if email is unique
//register new user, assigning a randomized id
//creates a new cookie session
app.post("/register", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  //verify unique email
  db.query(
    `SELECT email FROM users
    WHERE email = $1`, [email]
  )
  .then((result) => {
    if(result.rows.length){
      return res.send({
        error: "Email already exists!"
      });
    }
  })
  .catch(err => console.log(err.msg))

  //insert new user into database
  //creates new cookie session
  db.query(`
  INSERT INTO users(id, email, name, password)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `, [generateRandomInteger(), email, name, password])
  .then((result) => {
    const id = result.rows[0].id;
    req.session.user_id = id;
    // console.log('successfully logged in user :', id);

    return res.send({
      sucess: "200"
    });
  })
  .catch(err => console.log(err.msg));
});



//check login credentials and returns an error or success response to client-side
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    `SELECT * FROM users
    WHERE email = $1`, [email]
  )
  .then((result) => {
    if(!result.rows.length){
      return res.send({
        error: "email does not exist"
      });
    }

    if(result.rows[0].password !== password){
      return res.send({
        error: "incorrect password"
      });
    }

    //if email and password are correct 
    //new session created and redirect
    const id = result.rows[0].id;
    req.session.user_id = id;
    // console.log('successfully logged in user :', id);
    
    return res.send({
      sucess: "200"
    });

  })
});



app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});





