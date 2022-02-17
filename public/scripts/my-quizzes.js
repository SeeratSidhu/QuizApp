$(()=>{

  const start = renderLibrary();

  start.then(()=>{
    //only attaches button  listeners if a quiz is rendered
    if($(".quiz-template").length){
      $(".list-btn").on("click", unlistQuiz);
      $(".unlist-btn").on("click", listQuiz);
      $(".del-btn").on("click", deleteBtn);
      $(".share-btn").on("click", shareBtn);
      $(".play-btn").on("click", playBtn);
    }

  })

});


//grabs all quizzes that are associated with the current logged user and
//renders them to the dom
const renderLibrary = () => {
  return $.get("/api/library")
  .then(results => {


    if(results.length === 0){
      let createQuizDiv = createNewQuizLink();
      return $(createQuizDiv).insertBefore($(".library"));
    }

    for(let result of results){
      const $quiz = renderQuizTemplate(result);
      $(".library-quizzes").append($quiz);
    }
  })
  .catch(err => console.log(err.msg));
}


//dynamically creates a dom element containing singular quiz information
const renderQuizTemplate = (quizObject) => {

  //hides button dependent on the active state of the quiz
  const listClass = quizObject.is_active ? "hidden" : "";
  const unlistClass = quizObject.is_active ? "" : "hidden";
  const $picture = generatePicture();
  

  const $quizTemplate = `
  <div class="quiz-template">
        
  <div class="quiz-picture">
    ${$picture}
    <div class="number-of-questions">
      <p>${quizObject.number_of_questions} question(s)</p>
    </div>

  </div>

  <div class="quiz-information">
    <div class="quiz-primary-nav">
      <div class="quiz-title">
        <h3>${quizObject.name}</h3>
        <p>
        (# <p class="quiz-id">${quizObject.id}</p>)
        </p>
      </div>
      <div class="quiz-actions">
        <button class="unlist-holder">
          <i class="fa-solid fa-eye-slash unlist-btn ${unlistClass}"></i>
        </button>
        <button class="list-holder">
          <i class="fa-solid fa-eye list-btn ${listClass}"></i>
        </button>
        <button class="del-holder">
          <i class="fa-solid fa-trash del-btn"></i>
        </button>
      </div>
    </div>

    <div class="quiz-secondary-nav">
      <p>Created on ${quizObject.created_at}</p>
      <p>${quizObject.number_of_plays} play(s)!</p>
      <button type="button" class="btn btn-primary share-btn">Share</button>
      <button type="button" class="btn btn-success play-btn">Play</button>

    </div>

  </div>

</div>
  `
  return $quizTemplate;
}



//change the state of the quiz
//hides the list button and shows the unlist button
const unlistQuiz = function(event){
  event.preventDefault();
  $(this).hide();
  const $unlist = $(this).parent(".list-holder").siblings(".unlist-holder").children(".unlist-btn");
  const id = $(this).closest(".quiz-actions").siblings(".quiz-title").children(".quiz-id").text();

  $.ajax({
    url: `/quizzes/${id}`,
    type: 'PUT',
    success: () => {
      $(this).addClass("hidden");
      $unlist.removeClass("hidden");
      $unlist.show();
    }
  })

};



//change the state of the quiz
//hides the list button and shows the unlist button
const listQuiz = function(event){
  event.preventDefault();
  const $list = $(this).parent(".unlist-holder").siblings(".list-holder").children(".list-btn")
  const id = $(this).closest(".quiz-actions").siblings(".quiz-title").children(".quiz-id").text();

  $.ajax({
    url: `/quizzes/${id}`,
    type: 'PUT',
    success: () => {
      $(this).addClass("hidden");
      $list.removeClass("hidden");
      $list.show();
    }
  })
};



//deletes quiz data from the database and from the front-end
const deleteBtn = function(event){
  event.preventDefault();
  const id = $(this).closest(".quiz-actions").siblings(".quiz-title").children(".quiz-id").text();
  const $quiz = $(this).closest(".quiz-template")

  if(confirm("are you sure?")){
    $.ajax({
      url: `quizzes/${id}`,
      type: 'DELETE',
      success: () => {
        // console.log('deleted')
        $quiz.remove();
      }
    })
  }


}


//copies quiz link onto clipboard
const shareBtn = function(event){
  event.preventDefault();
  const id = $(this).closest(".quiz-template").children(".quiz-information").children('.quiz-primary-nav').children(".quiz-title").children(".quiz-id").text();
  navigator.clipboard.writeText(`http://localhost:8080/quizzes/${id}`);
  alert(`Copied quiz link: http://localhost:8080/quizzes/${id}`);

}


//redirects user to the quiz
const playBtn = function(event){
  event.preventDefault();
  const id = $(this).closest(".quiz-template").children(".quiz-information").children('.quiz-primary-nav').children(".quiz-title").children(".quiz-id").text();
  window.location.href = `http://localhost:8080/quizzes/${id}`;
}

//returns a random picture link
const generatePicture = () => {
  const pictureLinks = [
    `https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__480.jpg" alt="quiz profile picture`,
    `https://images.unsplash.com/photo-1507290439931-a861b5a38200?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Zmxvd2VyJTIwYmxvb218ZW58MHx8MHx8&w=1000&q=80`,
    `https://media.istockphoto.com/vectors/math-equations-written-on-a-blackboard-vector-id1219382595?k=20&m=1219382595&s=612x612&w=0&h=c6Sl7WmSHRzGBN7ZQmClLIhcv55vjStOPKc-GrpBseU=`,
    `https://www.incimages.com/uploaded_files/image/1920x1080/getty_485008244_105123.jpg`,
    `https://scopeblog.stanford.edu/wp-content/uploads/2021/03/Scope-Dean-Music.jpg`,
    `https://blogs.uoregon.edu/rreidaad250/files/2014/05/art-auction-10e3hqz.jpg`
  ]

  const randomIndex = Math.floor(Math.random() * pictureLinks.length);
  return `<img class="picture" src="${pictureLinks[randomIndex]}" alt="quiz profile picture"></img>`
}


//renders a new quiz button
const createNewQuizLink = () => {
  const $createNewQuiz = `<div class="no-quizzes-div">
  <a class="create-quiz-link" href="/create-quizzes">Click here to make your first quiz!</a>
</div>`;

  return $createNewQuiz;
}