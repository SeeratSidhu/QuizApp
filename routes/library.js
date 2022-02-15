const express = require('express');
const router  = express.Router();


module.exports = (db) => {

  router.get("/", (req, res) => {
    let session = req.session;
    if(!session.user_id){
      return res.redirect("/login");
    }
    res.render("library", {user: session.user_id});
  });

  //adds quiz and returns quiz id
  // router.post("/", (req, res) => {

    
  // });

  return router;

}