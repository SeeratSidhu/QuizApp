$(()=>{
  renderLibrary();





});

const renderLibrary = () => {
  $.get("/library")
  .then(results => {
    for(let result of results){
      const $quiz = renderQuizTemplate(result);
      $(".library-quizzes").append($quiz);
    }
  })
  .catch(err => console.log(err.msg));
}

const renderQuizTemplate = (quizObject) => {
  const $quizTemplate = `
  <div class="quiz-template">
        
  <div class="quiz-picture">
    <div class="number-of-questions">
      <p>${quizObject.number_of_questions} questions</p>
    </div>

  </div>

  <div class="quiz-information">
    <div class="quiz-primary-nav">
      <div class="quiz-title">
        <h3>${quizObject.name}</h3>
      </div>
      <div class="quiz-actions">
        <button>
          <i class="fa-solid fa-eye-slash unlist-btn"></i>
        </button>
        <button>
          <i class="fa-solid fa-eye list-btn"></i>
        </button>
        <button>
          <i class="fa-solid fa-trash play-btn"></i>
        </button>
      </div>
    </div>

    <div class="quiz-secondary-nav">
      <p>Created on ${quizObject.created_at}</p>
      <p>7 plays!</p>
      <button type="button" class="btn btn-primary">Edit</button>
      <button type="button" class="btn btn-success">Play</button>

    </div>

  </div>

</div>
  `
  return $quizTemplate;
}

