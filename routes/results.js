const express = require('express');
const router  = express.Router();
const { generateRandomInteger } = require("../helpers/create-random-integer");

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
      return res.send("Please login to check results");
    }
    const queryString = `SELECT * FROM results WHERE owner_id = $1`;
    const values = [Number(user_id)];
    db.query(queryString, values)
    .then(data => {
      if(data.rows.length === 0) {
        return res.send("No results to show");
      }
      res.render("results", {results: data.rows});
    })
    .catch(err => {
      console.log("Error: ", err.message);
    });


  });
  return router;
};
