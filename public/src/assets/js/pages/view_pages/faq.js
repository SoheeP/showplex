let cards = common.elm('.card'),
footer = common.elm('.footer__parent');

if(cards.length < 3){
  footer.classList.add('footer__bottom');
}