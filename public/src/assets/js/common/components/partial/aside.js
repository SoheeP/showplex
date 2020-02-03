
let menuToggleButton = document.querySelector('.aside__menu__button');
let asideMenu = document.querySelector('.aside__menu');

menuToggleButton.addEventListener('click', ()=>{
  asideMenu.classList.toggle('fold');
  asideMenu.querySelector('ul').classList.toggle('hidden');
  asideMenu.querySelector('.aside__menu__title').classList.toggle('hidden');
  let iconText = menuToggleButton.querySelector('i').innerText;
  if(iconText === 'menu_open'){
    menuToggleButton.querySelector('i').innerText = 'menu'
  } else {
    menuToggleButton.querySelector('i').innerText = 'menu_open'
  }
})

let href = window.location.href;
let linkBlock = document.querySelectorAll('[data-location]');

if(href.indexOf('mypage') > 0){
  linkBlock[0].classList.add('active');
  linkBlock[1].classList.remove('active')
} else {
  linkBlock[1].classList.add('active');
  linkBlock[0].classList.remove('active')
}
