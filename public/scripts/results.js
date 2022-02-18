$(() => {
  $("#alert-copy").hide();

    //copy the link to clipboard and show an alert
  $(".card-body").on("click", "#share-link", function(event) {

    event.preventDefault();
    const resultUrl = $(this).attr("data");

    navigator.clipboard.writeText(`http://localhost:8080/results/${resultUrl}`);
    $("#alert-copy").toggle();

    //close alert after 1 sec
    setTimeout(() => {
      $("#alert-copy").toggle();
    }, 1000)
  });

  //close the alert
  $(".close").on("click", function() {
    $(".alert").hide();
  });
})
