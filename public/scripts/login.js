$(()=>{

  $(".login-form").on("submit", userLogin);

});


//send email and password to server for verification
const userLogin = function(event) {
  event.preventDefault();
  const email = $(this).children(".email-holder").children(".email").val();
  const password = $(this).children(".password-holder").children(".password").val();

  const loginObject = {
    email,
    password
  };

  $.post("/login", loginObject)
    .then((result) => {
      checkError(result);
    });
};

//recieves an object from the server....
//displays error message if login fails and redirects on success
const checkError = (loginResult) => {

  //display error
  if (loginResult.error) {
    let $loginError = $(".login-error-message");
    $loginError.text(loginResult.error);
    return $loginError.show();
  }

  //redirect
  if (loginResult.sucess) {
    return window.location.href = "/";
  }

};