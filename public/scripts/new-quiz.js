
$(()=>{

  $(".quiz-title").focus();

  //event listener for add question button
  $(".add-question-btn").on("click", addQuestionButton);

  //event listener for quiz submit button
  $(".new-quiz-form").on("submit", createQuizButton);

});



//returns question form template with a random coloured background
const renderQuestion = () => {

  const $questionTemplate =
    `<div class=" form-group question ${randomBackground()}">
      <h3>Question</h3>
      <button type="button" class="delete-question">

        <i class="fa-solid fa-delete-left"></i>
      </button>

      <div class="question-holder">
        <input type="text" class="form-control shadow-none question-name"  placeholder="Enter question" name="question" required>
      </div>

      <div class="all-options">
        <div class="option-holder">
          <label >Answers 1</label>
          <input type="text" name="option" class="option-value" required>

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 2</label>
          <input type="text" name="option" class="option-value" required>

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 3</label>
          <input type="text" name="option" class="option-value" required>

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 4</label>
          <input type="text" name="option" class="option-value" required>

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="is_correct" class="is_correct">
          </div>
        </div>        

      </div>
  </div>`;

  return $questionTemplate;
};



/* insert a new quiz into the database and
returns quiz id value after new quiz is create */

const createQuiz = function() {
  //will need to dom tree traversal
  const title = $(".quiz-title").val();

  $.post("/create-quizzes", {title})
    .then((data)=>{
      console.log("New quiz created!");

      //creates questions after a new quiz is made
      //need to pass in the generated quiz id
      createQuestions(data.id);
    });
};



/* Accepts a quiz_id value to be used to
insert new questions for that specific quiz.
Will return the corresponding question_id
after insertation */

const createQuestions = (id) => {

  //grabs all question-containers
  const questions = $(".question");

  //loop to grab all question
  for (let question of questions) {
    const question_text = $(question).children(".question-holder").children(".question-name").val();
    const quiz_id = id;
    
    const questionObject = {
      question_text,
      quiz_id
    };

    $.post(`/create-quizzes/${quiz_id}/questions`, questionObject)
      .then((data)=>{
        console.log("New question added!");
        //creates options for the current question
        createOptions(question, data.id, data.quiz_id);
    
      })
      .catch(err => console.log(err.message));
    
    
  }
};



/* Accepts a question_id value to be used to
insert new question options for that specific quiz */

const createOptions = (location, questionId, quizId) => {
  //grabs all options related to a specific question
  //will need to pass in the question id
  const options = $(location).children(".all-options").children(".option-holder");
  
  for (let option of options) {
    const option_value = $(option).children(".option-value").val();
    const is_correct = $(option).children(".check-correct").children(".is_correct").is(":checked");
  
    const optionObject = {
      question_id: questionId,
      value: option_value,
      is_correct
    };
  
    // console.log(optionObject);
    //update datebase with options
    $.post(`/create-quizzes/${quizId}/${questionId}/options`, optionObject)
      .then(()=>{
        console.log("New option added!");
      })
      .catch((err) => console.log(err));
  }

  //redirect to home
  window.location.href = "/";
};



//add question button function
const addQuestionButton = function(event){
  event.preventDefault();
    
  //creates a question form
  $(renderQuestion()).insertBefore($(this).parent(".general-form-buttons"));

  //add delete functionality to the question upon generation
  $(".delete-question").on("click", function(event) {
    event.preventDefault();
    console.log("removed question!");
    $(this).parent(".question").remove();
 
  });

  //focuses on the first input field in the newly generated question form
  const $lastQuestionTitle = $(lastQuestion()).children(".question-holder").children(".question-name");
  $($lastQuestionTitle).focus()
  

};



const createQuizButton = function(event){
  event.preventDefault();

  //fix this to use THIS keyword
  //simple check to see if there are any questions
  let numberOfQuestions = $(".new-quiz-form").children(".question").length;

  if (numberOfQuestions === 0) {
    return alert("You must have question in your quiz!");
  }

  // creates quiz -> creates questions -> creates options
  createQuiz();
};



//adds a random colour class
const randomBackground = () => {
  const colourClasses = ["colour1", "colour2", "colour3", "colour4", "colour5"];

  const index = Math.floor(Math.random() * colourClasses.length);

  return colourClasses[index];
};


//returns the last question div
const lastQuestion = () => {
  const lastQuestionIndex = $(".question").length - 1;
  const $lastQuestionDiv = $(".question")[lastQuestionIndex];

  return $lastQuestionDiv;
}
