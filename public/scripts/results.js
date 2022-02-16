$(() => {
  $(".alert").hide();
  $(".card-body").on("click", "#share-link", function(event) {
    event.preventDefault();
    const resultUrl = $(this).attr("data");
    navigator.clipboard.writeText(`http://localhost:8080/results/${resultUrl}`);
    $(".alert").toggle();
  });
  $(".close").on("click", function() {
    $(".alert").hide();
  })
})
