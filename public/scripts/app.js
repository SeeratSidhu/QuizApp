// Client facing scripts here

// hamburger menu


const hamburger = document.getElementById('hamburger');
let navUl = document.getElementsByClassName('navSection');

console.log(navUl);

hamburger.addEventListener('click', () => {

  for (let item of navUl) {
    item.classList.toggle('show');
  }
})

