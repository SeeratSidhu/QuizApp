$(()=>{


  
  $(".add-question-btn").on("click", function(event){
    event.preventDefault();
    
    $(renderQuestion(questionNumber)).insertBefore(this);
  })
  
  $(".new-quiz-form").on("submit", function(event){
    event.preventDefault();
    console.log("-------submitted form---------")

    createQuiz();
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
          <input type="text" name="option" class="option-value">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 2</label>
          <input type="text" name="option" class="option-value">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 3</label>
          <input type="text" name="option" class="option-value">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 4</label>
          <input type="text" name="option" class="option-value">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
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
  .then(()=>{
    //will need to send back a generated quiz id
    console.log('send title of the quiz')

    //creates questions after a new quiz is made
    //need to pass in the generated quiz id
    createQuestions();
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


    //grabs all options related to a specific question
    //will need to pass in the question id
    const options = $(question).children(".all-options").children(".option-holder");
    
    for(let option of options){
      let option_value = $(option).children(".option-value").val();
      let is_correct = $(option).children(".check-correct").children(".is_correct").val();

      console.log({value: option_value, is_correct});
    }
  }
}

// const createOptions = () => {

// }


