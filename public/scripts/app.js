// Client facing scripts here

// hamburger menu


const hamburger = document.getElementById('hamburger');
let navUl = document.getElementsByClassName('navSection');

hamburger.addEventListener('click', () => {
  navUl.classList.toggle('show');
})
