const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {

    const { score, quiz_id } = req.body;

    db.query(`INSERT INTO results (id, quiz_id, owner_id, value)
    VALUES ($1, $2, $3, $4)`, [7, Number(quiz_id), 10001, Number(score)])
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
