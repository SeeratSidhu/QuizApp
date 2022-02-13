
$(()=>{


  //adds new question form
  $(".add-question-btn").on("click", function(event){
    event.preventDefault();
    
    $(renderQuestion()).insertBefore(this);

    $(".delete-question").on("click", function(event){
      event.preventDefault();
      console.log("removed question!");
      $(this).parent(".question").remove();
   
    })
  })
  
  $(".new-quiz-form").on("submit", function(event){
    event.preventDefault();

    //fix this to use THIS keyword
    //simple check to see if there are any questions
    let numberOfQuestions = $(".new-quiz-form").children(".question").length;

    if(numberOfQuestions === 0){
      return alert("You must have question in your quiz!");
    }

    // creates quiz -> creates questions -> creates options
    createQuiz();
  })
  
  
  
});



//tracks question number

const renderQuestion = () => {

  const $questionTemplate = 
    `<div class=" form-group question ${randomBackground()}">
      <h3>Question</h3>
      <button type="button" class="btn btn-danger delete-question">del</button>

      <div class="question-holder">
        <input type="text" class="form-control question-name"  placeholder="Enter question" name="question" required>
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
}



const createQuiz = function(){
  //will need to dom tree traversal
  const title = $(".quiz-title").val();

  $.post("/add-quizzes", {title})
  .then((data)=>{
    //will need to send back a generated quiz id
    console.log("New quiz created!")

    //creates questions after a new quiz is made
    //need to pass in the generated quiz id
    createQuestions(data.id);
  })
}



const createQuestions = (id) => {
  //id quiz id value
  //grabs all question-containers
  const questions = $(".question");



  //loop to grab all question names
  for(let question of questions){
    const question_text = $(question).children(".question-holder").children(".question-name").val();
    const quiz_id = id;
    
    const questionObject = {
      question_text,
      quiz_id
    }

    $.post("/add-questions", questionObject)
    .then((data)=>{
      console.log("New question added!")
      //creates options for the current question
      createOptions(question, data.id);
    
    })
    .catch(err => console.log(err.message))
    
    
  }
}



const createOptions = (location, questionId) => {
  //grabs all options related to a specific question
  //will need to pass in the question id
  const options = $(location).children(".all-options").children(".option-holder");
  
  for(let option of options){
    const option_value = $(option).children(".option-value").val();
    const is_correct = $(option).children(".check-correct").children(".is_correct").is(":checked");
  
    const optionObject = {
      question_id: questionId,
      value: option_value,
      is_correct
    }
  
    // console.log(optionObject);
    //update datebase with options
    $.post("/add-options", optionObject)
    .then(()=>{
      console.log("New option added!")
    })
    .catch((err) => console.log(err))
  }

  //redirect to home
  window.location.href = "/";
}



//adds a random colour class
const randomBackground = () => {
  let colourClasses = ["colour1", "colour2", "colour3", "colour4", "colour5"]

  index = Math.floor(Math.random() * colourClasses.length)

  return colourClasses[index];
}