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
  const id = Math.floor(Math.random() * 899999 + 100000);
  const title = $(".quiz-title").val();

  $.post("/add-quiz", {id, title})
  .then(()=>{
    //will need to send back a generated quiz id
    console.log('sent title of the quiz')
    console.log("quiz id is : ", id)

    //creates questions after a new quiz is made
    //need to pass in the generated quiz id
    createQuestions(id);
  })
}

const createQuestions = (id) => {
  //id quiz id value
  //grabs all question-containers
  let questions = $(".question");


  //loop to grab all question names
  for(let question of questions){
    const question_text = $(question).children(".question-holder").children(".question-name").val();
    const question_id = Math.floor(Math.random() * 899999 + 100000);
    const quiz_id = id;
    
    const questionObject = {
      question_text,
      question_id,
      quiz_id
    }

    console.log ("question is ------" , questionObject);


    //grabs all options related to a specific question
    //will need to pass in the question id
    const options = $(question).children(".all-options").children(".option-holder");
    
    for(let option of options){
      const option_id = Math.floor(Math.random() * 899999 + 100000);
      const option_value = $(option).children(".option-value").val();
      const is_correct = $(option).children(".check-correct").children(".is_correct").val();

      let optionObject = {
        id: option_id,
        question_id: question_id,
        value: option_value,
        is_correct
      }

      // console.log(optionObject);
      createOptions(optionObject);

    }
  }
}

const createOptions = (option) => {

  $.post("/add-option", option)
  .then(()=>{console.log("created a new option!")})
  .catch(err => console.log(err.message))


}


