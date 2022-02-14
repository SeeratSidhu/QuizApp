$(()=>{

  $(".register-form").on("submit", registerUser)

});


//send email and password to server for verification
const registerUser = function(event){
  event.preventDefault();
    const name = $(this).children(".name-holder").children(".email").val();
    const email = $(this).children(".email-holder").children(".email").val();
    const password = $(this).children(".password-holder").children(".password").val();

    if(!name || !email || !password){
     return checkError({error: "All input fields must be filled in"})
    }

    const newUser = {
      name,
      email,
      password
    }

    $.post("/register", newUser)
    .then((result) => {
      checkError(result);
    })
}

//recieves an object from the server....
//displays error message if login fails and redirects on success
const checkError = (registerResult) => {

  //display error
  if(registerResult.error){
    let $registerError = $(".register-error-message")
    $registerError.text(registerResult.error);
    return $registerError.show();
  }

  //redirect
  if(registerResult.sucess){
    // return window.location.href = "/";
    console.log("okay!")
  }

}