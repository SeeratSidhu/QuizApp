const express = require('express');
const router = express.Router();


module.exports = (db) => {


  //move to quizzes later - quizzes:id
  router.get("/", (req, res) => {
    let sessionID = req.session.user_id;
    if (!sessionID) {
      return res.redirect("/");
    }

    db.query(`
    SELECT quizzes.id, quizzes.owner_id, is_active, quizzes.name, TO_CHAR(quizzes.created_at, 'YYYY/MM/DD') as created_at,
    count(DISTINCT questions.id) as number_of_questions, count(results.id) as number_of_plays
    FROM quizzes
    JOIN questions ON questions.quiz_id = quizzes.id
    LEFT JOIN results ON quizzes.id = results.quiz_id
    WHERE quizzes.owner_id = $1
    GROUP BY quizzes.id
    ORDER BY created_at DESC, number_of_plays DESC;
    `, [sessionID])
      .then((result) => {
        console.log(result.rows);
        return res.send(result.rows);
      })
      .catch(err => {
        console.log(err.msg);
        return res.redirect("/");
      })



  })

  return router;

}
