$(() => {
  loadQuiz();
  $("main").on("click", "#submit-button", checkQuestion);
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
  }, 2000);
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
  $(".results").html(`<h1>You Scored ${score} out of ${currentQuestion}</h1>`);
}

const pendingQuestions = (dataArray) => {
  $("#pending").text(dataArray.length - currentQuestion + "/" + dataArray.length);
}
