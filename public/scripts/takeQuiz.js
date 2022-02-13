$(() => {
  loadQuiz();
});

const loadQuiz = () => {
  getQuizData()
  .then(data => {
    renderQuestions(data, 3);
  });
}

const getQuizData = () => {
  let pathName = window.location.pathname;
  return $.get(`/api${pathName}`)
  .then(data => {
    return data;
  });
}
const createQuestion = (questionObject) => {
  // let option = questionObject.options;
  // const $question = `<article class="question">
  // <p>${questionObject.question.value}</p>
  // <div class="options">
  // <div class="option">
  //   <input type= "radio" id="option${option[0].id}" name="q${questionObject.question.id}" value="${option[0].value}">
  //   <label for="option${option[0].id}">${option[0].value}</label>
  // </div>
  // <div class="option">
  // <input type= "radio" id="option${option[1].id}" name="q${questionObject.question.id}" value="${option[1].value}">
  // <label for="option${option[1].id}">${option[1].value}</label>
  // </div>
  // <div class="option">
  // <input type= "radio" id="option${option[2].id}" name="q${questionObject.question.id}" value="${option[2].value}">
  // <label for="option${option[2].id}">${option[2].value}</label>
  // </div>
  // <div class="option">
  // <input type= "radio" id="option${option[3].id}" name="q${questionObject.question.id}" value="${option[3].value}">
  // <label for="option${option[3].id}">${option[3].value}</label>
  // </div>
  // </div>
  // </article>
  // `;

  const $question = `<section class="quiz-item">
    <div class="question">${questionObject.question.value}</div>
  `;

  return $question;
};

const renderQuestions = (quizArray, qNumber) => {

  if(qNumber >= quizArray.length) {
    console.log("No more Questions!")
    return;
  }
  let qItem = quizArray[qNumber].question.value;
  let optionItems = quizArray[qNumber].options;

  const $question = `<form class="quiz-form">
  <p class="question">${qItem}<p>
  <ul class="radiogroup" role="radiogroup" aria-labelledby="question"></ul>
  </form>`;

  console.log($question);
  const options = optionItems.map((option, index) => {
    return `<label for="${option.value}">
      <input type="radio" id="option${option.id}" name="option" tabindex="${index}" value="${option.value}" aria-checked="false" required>
      ${option.value}
      </label>`
  });
  $(".quiz-container").append($question);
  $(".radiogroup").append(options);

  // for (let question of quizArray) {
  //   const $question =`
  //   <div class="question">${question.question.value}</div>
  //   <fieldset id="${question.question.id}"></fieldset>

  //   `;
  //   $(".question-container").append($question);

  //   question.options.forEach((option) => {
  //     let $option = `<label><input type= "radio" name="q${question.question.id}" value="${option.value}" />
  //     ${option.value}
  //     </label>`
  //     $(`#${question.question.id}`).append($option);
  //   });
  // }
};
