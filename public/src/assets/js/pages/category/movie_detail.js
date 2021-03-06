
// rating
document.querySelector('[data-rating]').style.width = `${document.querySelector('[data-rating]').getAttribute('data-rating')}%`;

// other slider
var mySwiper = new Swiper('.swiper-container-mini', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,

  // Navigation arrows
  navigation: {
    nextEl: '.section__slide-mini__button-next',
    prevEl: '.section__slide-mini__button-prev',
  },

  speed: 500,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 3,
      spaceBetween: 5
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 4,
      spaceBetween: 10
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 6,
      spaceBetween: 10
    },
    720: {
      slidesPerView: 10,
      spaceBetween: 25
    }
  }
})