const express = require('express');
const router = express.Router();

module.exports = (db) => {

  //get all quizzes from db
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM quizzes`)
    .then(data => {
      res.json(data.rows);
    })
  });


  //get quiz by quiz_id
  router.get("/:id", (req, res) => {
    db.query(`SELECT questions.value AS question_value, options.* FROM questions
    JOIN options ON options.question_id = questions.id
    WHERE quiz_id = $1 GROUP BY question_id, questions.value, options.id;`, [req.params.id])
    .then(data => {
      const dataArray = [];
      let index = 0;
      const optionsArray = [];
      let questionID = data.rows[0].question_id;

      for (let row of data.rows) {
        if (questionID !== row.question_id) {
          questionID = row.question_id;
          index++;
          optionsArray.length = 0;
        }

        let question = {
          value: row.question_value,
          id: row.question_id
        }
        let option = {
          id: row.id,
          value: row.value,
          is_correct: row.is_correct
        }
        optionsArray.push(option);

        dataArray[index] = {
          question,
          options: [...optionsArray]
        }
      }

      res.json(dataArray);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  });

  return router;
}
