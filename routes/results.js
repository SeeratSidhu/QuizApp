const express = require('express');
const router  = express.Router();
const { generateRandomInteger } = require("../helpers/create-random-integer");
const timeago = require('timeago.js');

module.exports = (db) => {
  router.post("/", (req, res) => {

    const { score, quiz_id } = req.body;
    const user_id = req.session.user_id;
    const id = generateRandomInteger();

    db.query(`INSERT INTO results (id, quiz_id, owner_id, value)
    VALUES ($1, $2, $3, $4)`, [id, Number(quiz_id), user_id, Number(score)])
      .then(data => {
        res.sendStatus(201);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/", (req, res) => {
    const user_id = req.session.user_id;
    if(!user_id) {
      return res.render("results", {result: false});
    }
    const queryString = `SELECT quizzes.name, results.* FROM results JOIN quizzes ON quizzes.id = results.quiz_id WHERE results.owner_id = $1`;
    const values = [Number(user_id)];
    db.query(queryString, values)
    .then(data => {
      if(data.rows.length === 0) {
        return res.render("results", {result: false});
      }

      res.render("results", {results: data.rows, result: true, timeago});
    })
    .catch(err => {
      console.log("Error: ", err.message);
    });

  });

  router.get("/:id", (req, res) => {
    const result_id = req.params.id;
    const queryString = `SELECT quizzes.id AS quiz_id, quizzes.name AS quiz_name, COUNT(questions.id) AS num_of_questions, quizzes.created_at, results.value, results.owner_id FROM questions JOIN quizzes ON quizzes.id = questions.quiz_id JOIN results ON results.quiz_id = quizzes.id WHERE results.id = $1 GROUP BY quizzes.id, results.value, results.owner_id;`
    const values = [Number(result_id)];
    db.query(queryString, values)
    .then((data) => {
      let result = data.rows[0];
      res.render("result-page", {
        quizName: result.quiz_name,
        quizId: result.quiz_id,
        score: result.value,
        userId: result.owner_id,
        totalQuestions: result.num_of_questions,
        quizAge: result.created_at,
        timeago
      })
    })
    .catch(err => {
      console.log("Error: ", err.message);
    })
  });

  router.post("/:id/delete", (req, res) => {
    const resultId = req.params.id;
    console.log("clikced!", resultId)
    const queryString = `DELETE FROM results WHERE id = $1`;
    db.query(queryString,[Number(resultId)])
    .then(data => {
      console.log("DELETED!");
      res.redirect("/results");
    })
    .catch(err => console.log("Error: ", err.message));
  });

  return router;
};
