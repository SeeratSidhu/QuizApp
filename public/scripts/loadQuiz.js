$(() => {
  loadQuiz();
  $("main").on("click", "#submit-button", checkQuestion);
  $(".results").on("click", "#save-result-button", postResult);
  getQuizName();
});
let currentQuestion = 0;
let score = 0;

const loadQuiz = () => {

  getQuizData()
  .then(data => {
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

  const $question = `<form class="quiz-form">
  <p class="question">${qItem}<p>
  <ul class="radiogroup" role="radiogroup" aria-labelledby="question"></ul>
  </form>`;

  const options = optionItems.map((option, index) => {
    return `<label for="${option.value}">
      <input type="radio" id="option${option.id}" name="option" tabindex="${index}" value="${option.id}" aria-checked="false" required>
      ${option.value}
      </label>`
  });

  let button = `<button type="submit" id="submit-button">${qNumber === quizArray.length - 1 ? `Check Score` : `Next`}</button>`;
  $(".quiz-container").append($question);
  $(".radiogroup").append(options, button);
};

// const toggleQuestion = () => {

// }

const nextQuestion = () => {
  currentQuestion++;
  setTimeout(() => {
    $(".answer-message").empty();
    loadQuiz();
  }, 100);
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
  const data = {
    score: totalScore,
    quiz_id: 1
  }
  $.post("/api/results", data);
  $(".results").html(`<h1>Your score ${totalScore} has been saved!<h1>`);
}

const getQuizName = () => {
  let pathname = window.location.pathname.split("/");
  let quizID = pathname[pathname.length-1];
  let route = pathname[pathname.length-2];
  $.get(`/api/${route}`)
  .then(data => {
    const quizName = data.filter(quiz => quiz.id == quizID);
    $("header h1").text(quizName[0].name);
  })
}
