const express = require('express');
const router  = express.Router();
const { generateRandomInteger } = require("../helpers/create-random-integer");



module.exports = (db) => {

  router.get("/", (req, res) => {
    res.render("new-quiz")
  })

  //adds quiz and returns quiz id
  router.post("/", (req, res) => {
  
    const id = generateRandomInteger();
    const values = [id, req.body.title];
  
    return db.query(`INSERT
    INTO quizzes (id, owner_id, name)
    VALUES ($1, 10002, $2)
    RETURNING *;
    `,values)
    .then((result)=> {
       console.log("new quiz ... ",result.rows[0]);
      res.send(result.rows[0]);
    })
    .catch(err => console.log(err.msg))
    
  });


  //add question and returns question id
  router.post("/:quizId/questions", (req,res) => {
    const question_id = generateRandomInteger();
    const values = [question_id , req.body.quiz_id, req.body.question_text];
  
    return db.query(`INSERT
    INTO questions(id, quiz_id, value)
    VALUES($1, $2, $3)
    RETURNING *;
    `, values)
    .then((result)=> {
      console.log("new question ... ",result.rows[0]);
      res.send(result.rows[0]);
   })
   .catch(err => console.log(err.msg))
  
  });


  //adds options to a question
  router.post("/:quizId/:questionId/options", (req,res) => {
    const option_id = generateRandomInteger()
    const values = [option_id, req.body.question_id, req.body.value, req.body.is_correct]
  
    return db.query(`INSERT
    INTO options(id, question_id, value, is_correct)
    VALUES($1, $2, $3, $4)
    RETURNING *;
    `, values)
    .then((result)=> {
      console.log("new option ... ",result.rows[0]);
      res.send(result.rows[0]);
      // res.redirect("/");
   })
   .catch(err => console.log(err.msg))
  
  })


  
  return router;
};
