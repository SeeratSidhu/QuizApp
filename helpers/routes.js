const { generateRandomInteger } = require("../helpers/create-random-integer");
const {Pool} = require("pg");
const dbParams = require("../lib/db.js");
const db = new Pool(dbParams);


//register user function to be called in serverjs file
const register = (req,res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

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
    // //insert new user into database
    // //creates new cookie session

    db.query(`
    INSERT INTO users(id, email, name, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `, [generateRandomInteger(), email, name, password])
    .then((result) => {
      const id = result.rows[0].id;
      req.session.user_id = id;
      // console.log('successfully logged in user :', id);
  
      return res.send({
        sucess: "200"
      });
    })

  })
  .catch(err => console.log(err.msg))
}



//login function to be passed into server.js
const login = (req, res) => {

  const email = req.body.email;
  const password = req.body.password;

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

    if(result.rows[0].password !== password){
      return res.send({
        error: "incorrect password"
      });
    }

    //if email and password are correct 
    //new session created and redirect
    const id = result.rows[0].id;
    req.session.user_id = id;
    // console.log('successfully logged in user :', id);
    
    return res.send({
      sucess: "200"
    });

  })

}



module.exports = { register, login };