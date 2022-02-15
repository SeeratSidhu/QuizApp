$(() => {
  loadQuiz();
  $("main").on("click", "#next-btn", checkQuestion);
  $(".results").on("click", "#save-result-button", postResult);
});
let currentQuestion = 0;
let score = 0;
let quizID;

const loadQuiz = () => {

  getQuizData()
  .then(data => {
    getQuizName();
    renderQuestions(data, currentQuestion);
    pendingQuestions(data);

  });
}

const getQuizData = () => {

  let pathName = window.location.pathname;
  return $.get(`/api${pathName}`)
  .then(data => {
    return data;
  });
}

const renderQuestions = (quizArray, qNumber) => {
  $(".quiz-container").empty();
  if(qNumber >= quizArray.length) {
    console.log("No more Questions!");
    displayResults();
    return;
  }
  let qItem = quizArray[qNumber].question.value;
  let optionItems = quizArray[qNumber].options;

  const $question = `
  <div class="question">${qItem}</div>
  <div id="option-buttons" class="btn-grid"></div>
  `;

  const options = optionItems.map((option, index) => {
    return `<button id="option${option.id}" class="btn">${option.value}</button>`
  });

  $(".quiz-container").append($question);
  $("#option-buttons").append(options);
};

// const toggleQuestion = () => {

// }

const nextQuestion = () => {
  currentQuestion++;
  setTimeout(() => {
    $(".answer-message").empty();
    loadQuiz();
  }, 1500);
}

const correctAnswer = () => {
  $(".answer-message").text("🥳Correct Answer! woohooo!");
  score++;
  nextQuestion();
}

const wrongAnswer = (answer) => {
 $(".answer-message").text(`😭 Wrong Answer!! Correct Answer is ${answer}`);
 nextQuestion();

}

const checkQuestion = function(event) {
  event.preventDefault();
  const selectedOption = $("input[name=option]:checked").val();

  getQuizData()
  .then(data => {

    let allOptions = data[currentQuestion].options;
    const correctOption = allOptions.find(option => option.is_correct)

    if(correctOption.id === Number(selectedOption)) {
      correctAnswer();
      return;
    }
    return wrongAnswer(correctOption.value);
  })
}

const displayResults = () => {
  $("header h3").hide();
  let resultsELement = `
  <div >You scored <span id="score">${score}</span> out of ${currentQuestion}</div>
  <button id="save-result-button">Save Result</button>
 `;
  $(".results").html(resultsELement);
}

const pendingQuestions = (dataArray) => {
  $("#pending").text(dataArray.length - currentQuestion + "/" + dataArray.length);
}

const postResult = function(event){
  event.preventDefault();
  const totalScore = $(this).prev().children("#score").html();
  const resultData = {
    score: totalScore,
    quiz_id: quizID
  }
  console.log("yes", resultData);
  checkUserLogin().then(data => {
    if(data) {

      $.post("/results", resultData);
      $(".results").html(`<p>Your score has been saved!</p>`);

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
  })
}

const checkUserLogin = () => {
  return $.get("/quizzes")
  .then(data => {
    return data;
  });
}
