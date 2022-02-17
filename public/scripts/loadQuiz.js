$(() => {
  loadQuiz();
  getQuizName();
  $(".quiz-container").on("click", ".btn", checkQuestion)
  $("main").on("click", "#next-btn", nextQuestion);
  $(".results").on("click", "#save-result-button", postResult);
});

let currentQuestion = 0;
let score = 0;
let quizID;

const loadQuiz = () => {

  getQuizData()
  .then(data => {
    $("#next-btn").addClass("hide");
    renderQuestions(data, currentQuestion);
    pendingQuestions(data);
  });
}

//get questions and options from the api
const getQuizData = () => {

  let pathName = window.location.pathname;
  return $.get(`/api${pathName}`)
  .then(data => {
    return data;
  });
}

//create elmenents to store questions and options
const renderQuestions = (quizArray, qNumber) => {

  $(".quiz-container").empty();

  if(qNumber >= quizArray.length) {;

    displayResults();
    $(".on-complete").fadeTo(200, 0.2).fadeTo(200, 0.8);
    return;
  }

  let qItem = quizArray[qNumber].question.value;
  let optionItems = quizArray[qNumber].options;

  const $question = `
  <div class="question">${qItem}</div>
  <div id="option-buttons" class="btn-grid"></div>
  `;

  const $options = optionItems.map((option, index) => {
    return `<button id="option${option.id}" class="btn">${option.value}</button>`
  });

  $(".quiz-container").append($question);
  $("#option-buttons").append($options);
};


const nextQuestion = () => {

  currentQuestion++;

  $("#option-buttons").hide(600, function() {
    loadQuiz();
  });

}

//add classes and icons to buttons
const revealAnswer = (element) => {

  $(element).addClass("correct").prepend(`<i class="fa-solid fa-circle-check fa-2x icon"></i>`).prop("disabled", true);

  //disables all neighbouring buttons
  $(element).siblings(".btn").addClass("wrong").prepend(`<i class="fa-solid fa-circle-xmark fa-2x icon"></i>`).prop("disabled", true);

  $("#next-btn").removeClass("hide");
}


const checkQuestion = function(event) {

  event.preventDefault();
  $(".btn").css({filter:"none"});

  const selectedOption = $(this).text();

  getQuizData()
  .then(data => {

    let allOptions = data[currentQuestion].options;
    const correctOption = allOptions.find(option => option.is_correct)
    const correctOptionId = correctOption.id;
    const correctElement = $(`#option${correctOptionId}`);
    $(this).addClass("selected");

    if(correctOption.value === selectedOption) {
      score++;
      revealAnswer($(this));
      return;
    }
    return revealAnswer(correctElement);
  })
}

//give message on quiz completion
const displayResults = () => {

  const quizName = $("header h1").text();
  let resultsELement = `
  <h1 class="on-complete">${quizName} Completed!</h1>
  <div>Your score: <span id="score">${score}</span> / ${currentQuestion}</div>
  <button id="save-result-button" class="next-btn btn">Save</button>
 `;

  $("#next-btn").addClass("hide");
  $(".results").html(resultsELement);
}

//animate progress bar
const pendingQuestions = (dataArray) => {

  const quizLength = dataArray.length;
  const docWidth = $("#outer-div").width();
  const percentCompleted = docWidth*((currentQuestion)/quizLength);

  $("#inner-div").animate({"width": percentCompleted});
}

//update results on save
const postResult = function(event){
  event.preventDefault();

  const totalScore = $(this).prev().children("#score").html();
  const resultData = {
    score: totalScore,
    quiz_id: quizID
  }

  checkUserLogin().then(data => {
    if(data) {
      $.post("/results", resultData);
      $(".results").html(`<p>Saved! Check out your <a href="/results">results</a> or take a new <a href="/">quiz</a>!`);

    } else {
      $(".results").html(`<p>Please <a href="/login">Login</a> to save results!</p>`);
    }

  });
}

const getQuizName = () => {

  let pathname = window.location.pathname.split("/");
  quizID = pathname[pathname.length-1];
  let route = pathname[pathname.length-2];

  $.get(`/api/${route}`)
  .then(data => {
    const quizName = data.filter(quiz => quiz.id == quizID);

    $("header h1").text(quizName[0].name);
  });
}

const checkUserLogin = () => {
  return $.get("/quizzes")
  .then(data => {
    return data;
  });
}
