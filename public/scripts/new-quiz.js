$(()=>{


  
  $(".add-question-btn").on("click", function(event){
    event.preventDefault();
    console.log("clicked!")
    
    $(renderQuestion(questionNumber)).insertBefore(this);
  })
  
  
  
  
  
  
  
  
});

let questionNumber = 1;

const renderQuestion = (value) => {
  questionNumber += 1;

  const $questionTemplate = 
    `<div class=" form-group question">
      <div class="question-holder">
        <label>Question ${value}</label>
        <input type="text" class="form-control"  placeholder="Enter question" name="question">
      </div>

      <div class="all-options">
        <div class="option-holder">
          <label >Answers 1</label>
          <input type="text" name="question-${value}-option1">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="o1-is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 2</label>
          <input type="text" name="question-${value}-option2">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="o2-is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 3</label>
          <input type="text" name="question-${value}-option3">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="o3-is_correct">
          </div>
        </div>

        <div class="option-holder">
          <label >Answers 4</label>
          <input type="text" name="question-${value}-option4">

          <div class="check-correct">
            <label >Fill in for correct answer</label>
            <input type="checkbox" name="o4-is_correct">
          </div>
        </div>
      </div>
  </div>`;

  return $questionTemplate;
}