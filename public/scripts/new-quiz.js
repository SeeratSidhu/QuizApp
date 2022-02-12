$(()=>{


  
  $(".add-question-btn").on("click", function(event){
    event.preventDefault();
    
    $(renderQuestion(questionNumber)).insertBefore(this);
  })
  
  $(".new-quiz-form").on("submit", function(event){
    event.preventDefault();
    console.log("submitted form")
    console.log(questionNumber -1)

    createQuiz();

    createQuestions();
  })
  
  
  
  
  
  
  
});

let questionNumber = 1;

const renderQuestion = (value) => {
  questionNumber += 1;

  const $questionTemplate = 
    `<div class=" form-group question">
      <div class="question-holder">
        <label>Question ${value}</label>
        <input type="text" class="form-control question-name"  placeholder="Enter question" name="question">
      </div>

      <div class="all-options">
        <div class="option-holder">
          <label >Answers 1</label>
          <input type="text" name="option">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 2</label>
          <input type="text" name="option">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 3</label>
          <input type="text" name="option">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 4</label>
          <input type="text" name="option">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct">
          </div>
        </div>
      </div>
  </div>`;

  return $questionTemplate;
}

const createQuiz = function(){
  //will need to dom tree traversal
  const title = $(".quiz-title").val();

  $.post("/add-quiz", {title})
  .done(()=>{
    console.log('send title of the quiz')
  })
}

const createQuestions = () => {

  //grabs all question-containers
  let questions = $(".question");

  //loop to grab all question names
  for(let question of questions){
    let question_text = $(question).children(".question-holder").children(".question-name").val();
    console.log(question_text);
    console.log ("----make new questions for specific quiz")
  }
}


