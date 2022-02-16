// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const morgan = require("morgan");
const cookieSession = require("cookie-session");

const {generateRandomInteger} = require("./helpers/create-random-integer");

const {register, login} = require("./routes/register-login");

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
app.use(
  cookieSession({
    secret: "random string for now",
    maxAge: 60 * 10 * 1000, //10 minutes - testing purposes (will use 24*60*60*1000 afterwards)
  })
);

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
const addRoutes = require("./routes/create-quizzes");
const quizzesRoutes = require("./routes/quizzes");
const resultsRoutes = require("./routes/results");
const library = require("./routes/library");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
app.use("/api/quizzes", quizzesRoutes(db));
app.use("/api/results", resultsRoutes(db));
app.use("/create-quizzes", addRoutes(db));
app.use("/api/library", library(db));
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

// app.get("/", (req, res) => {
//   res.render("index");
// });

app.get("/", (req, res) => {
  const user = req.session.user_id;

  console.log("userrr", user);


  let userCondition = ";";

  if (user) {
    userCondition = ` AND owner_id = ${user} OR owner_id IS NULL;`;
  } else {
    userCondition = ` AND owner_id IS NULL ;`
  }

  db.query(
    `SELECT id, name, owner_id FROM quizzes
    WHERE is_active = true
     ` + userCondition
  )
    .then((result) => {
      console.log(result.rows);
      res.render("index", {
        quizzes: result.rows.filter(quiz => !quiz.owner_id),
        myQuizzes: result.rows.filter((quiz) => {
          return quiz.owner_id;
        }),
        user: user,
      });
    })
    .catch((err) => {
      console.log("homepage error:", err);
    });
});

app.get("/my-quizzes", (req, res) => {
  res.render("my-quizzes");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", register);

app.post("/login", login);

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

app.get("/quizzes/:id", (req, res) => {
  res.render("quiz");
});

app.get("/quizzes", (req, res) => {
  if (req.session.user_id) {
    return res.sendStatus(200);
  }
  return res.send(undefined);
});



app.get("/library", (req, res) => {
  let session = req.session;
  if(!session.user_id){
    return res.redirect("/login");
  }
  res.render("library", {user: session.user_id});
});


app.put("/quizzes/:id", (req, res) => {
  const sessionId = req.session.user_id;
  const quizId = req.params.id;

  db.query(`
  SELECT owner_id 
  FROM quizzes
  WHERE id = $1;
  `,[quizId])
  .then(result => {
    if(result.rows[0].owner_id !== sessionId){
      throw `Not your quiz to unlist!`
    }

    return db.query(`
    UPDATE quizzes
    SET is_active = NOT is_active
    WHERE owner_id = $1 AND id = $2
    RETURNING *;
    `,[sessionId, quizId])
  })
  .then(()=>{
    console.log("Updated")
    res.send("ok")
  })
  .catch(err => console.log(err))
  
})


app.delete("/quizzes/:id", (req, res) => {
  const sessionId = req.session.user_id;
  const quizId = req.params.id;

  db.query(`
  SELECT owner_id 
  FROM quizzes
  WHERE id = $1;
  `,[quizId])
  .then(result => {
    if(result.rows[0].owner_id !== sessionId){
      throw `Not your quiz to delete!`
    }

    return db.query(`
    DELETE FROM quizzes
    WHERE owner_id = $1 AND id = $2
    RETURNING *;
    `,[sessionId, quizId])
  })
  .then(()=>{
    console.log("Deleted")
    res.send("ok")
  })
  .catch(err => console.log(err))
})


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
