const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get("/", (req, res) => {
    db.query(`SELECT * FROM quizzes`)
    .then(data => {
      res.json(data.rows);
    })
  })

  router.get("/:id", (req, res) => {
    db.query(`SELECT * FROM questions WHERE quiz_id = $1`, [req.params.id])
    .then(data => {
      res.json(data.rows);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
  })

  return router;
}
