/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
// const router = express.Router();
const usersRoutes = express.Router();

// module.exports = (db) => {
//   router.get("/", (req, res) => {
//     db.query(`SELECT * FROM users;`)
//       .then(data => {
//         const users = data.rows;
//         res.json({ users });
//       })
//       .catch(err => {
//         res
//           .status(500)
//           .json({ error: err.message });
//       });
//   });
//   return router;
// };


module.exports = (db) => {
  usersRoutes.get("/", (req, res) => {
    const user = req.session.user;
    // const email = req.session.email;
    db.query(
      "SELECT id, name FROM quizzes;"
    )
      .then((result) => {

        res.render("index", {
          quizzes: result.rows,
          user: user,
          // email: email
        });
      })
      .catch((err) => {
        console.log("homepage error:", err)
      })
  });
  return usersRoutes;
}
