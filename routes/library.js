const express = require('express');
const router  = express.Router();


module.exports = (db) => {


  //move to quizzes later - quizzes:id
  router.get("/", (req, res) => {
    let sessionID = req.session.user_id;
    if(!sessionID){
      return res.redirect("/");
    }
    
    db.query(`
    SELECT quizzes.*, count(questions.id) as number_of_questions
    FROM quizzes
    JOIN questions ON questions.quiz_id = quizzes.id
    WHERE quizzes.owner_id = $1
    GROUP BY quizzes.id
    ORDER BY created_at DESC;
    `, [sessionID])
    .then((result)=>{
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