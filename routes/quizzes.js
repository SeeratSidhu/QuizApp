const express = require('express');
const router = express.Router();

module.exports = (db) => {


  router.get("/", (req, res) => {
    if (req.session.user_id) {
      return res.sendStatus(200);
    }
    return res.send(undefined);
  });


  router.get("/:id", (req, res) => {
    const user = req.session.user_id;
    res.render("quiz", {user});
  });
  

  //sets quiz to active or inactive
  router.put("/:id", (req, res) => {
    const sessionId = req.session.user_id;
    const quizId = req.params.id;
  
    db.query(`
    SELECT owner_id
    FROM quizzes
    WHERE id = $1;
    `, [quizId])
      .then(result => {
        if (result.rows[0].owner_id !== sessionId) {
          throw `Not your quiz to unlist!`
        }
  
        return db.query(`
      UPDATE quizzes
      SET is_active = NOT is_active
      WHERE owner_id = $1 AND id = $2
      RETURNING *;
      `, [sessionId, quizId])
      })
      .then(() => {
        console.log("Updated")
        res.send("ok")
      })
      .catch(err => console.log(err))
  });
  

  //deletes specific quiz linked to the current logged in user
  router.delete("/:id", (req, res) => {
    const sessionId = req.session.user_id;
    const quizId = req.params.id;
  
    db.query(`
    SELECT owner_id
    FROM quizzes
    WHERE id = $1;
    `, [quizId])
      .then(result => {
        if (result.rows[0].owner_id !== sessionId) {
          throw `Not your quiz to delete!`
        }
  
        return db.query(`
      DELETE FROM quizzes
      WHERE owner_id = $1 AND id = $2
      RETURNING *;
      `, [sessionId, quizId])
      })
      .then(() => {
        console.log("Deleted")
        res.send("ok")
      })
      .catch(err => console.log(err))
  });
  
  

  return router;

}
