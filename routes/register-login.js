const { generateRandomInteger } = require("../helpers/create-random-integer");
const {Pool} = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);
const bcrypt = require('bcrypt');



//checks if email is unique
//register new user, assigning a randomized id
//creates a new cookie session
const register = (req,res) => {
  const { name, email, password } = req.body;
  //verify unique email
  db.query(
    `SELECT email FROM users
    WHERE email = $1`, [email]
  )
  .then((result) => {
    if(result.rows.length){
      return res.send({
        error: "Email already exists!"
      });
    }
    //hashes password    
    // //insert new user into database
    // //creates new cookie session
    bcrypt.hash(password, 10)
    .then(hash => {
      return db.query(`
      INSERT INTO users(id, email, name, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `, [generateRandomInteger(), email, name, hash])

    })
    .then((result) => {
      const id = result.rows[0].id;
      req.session.user_id = id;
      console.log('successfully logged in user :', id);
  
      return res.send({
        success: "200"
      });
    })

  })
  .catch(err => console.log(err.msg))
}



//check login credentials and returns an error or success response to client-side
const login = (req, res) => {

  const {email, password} = req.body;

  db.query(
    `SELECT * FROM users
    WHERE email = $1`, [email]
  )
  .then((result) => {
    if(!result.rows.length){
      return res.send({
        error: "email does not exist"
      });
    }

    bcrypt.compare(password, result.rows[0].password)
    .then(checkResult => {
      if(!checkResult){
        return res.send({
          error: "incorrect password"
        });

      }

      //if email and password are correct 
      //new session created and redirect
      const id = result.rows[0].id;
      req.session.user_id = id;
      console.log('successfully logged in user :', id);
      
      return res.send({
        sucess: "200"
      });
    })
  })
  .catch(err => {
    console.log(err.msg);
  })

}



module.exports = { register, login };