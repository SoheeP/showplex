var mySwiper = new Swiper('.swiper-container-main', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // Navigation arrows
  navigation: {
    nextEl: '.section__slide__button-next',
    prevEl: '.section__slide__button-prev',
  },
  autoplay: {
    delay: 5000
  },
  speed: 500
})

var mySwiper = new Swiper('.swiper-container-part.movie', {
  // Optional parameters
  direction: 'horizontal',
  loop: false,

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-container-part.movie .section__slide__button-next',
    prevEl: '.swiper-container-part.movie .section__slide__button-prev',
  },
  speed: 500,
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 2,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 3,
      spaceBetween: 30
    },
    // when window width is >= 640px
    640: {
      slidesPerView: 4,
      spaceBetween: 40
    },
    720: {
      slidesPerView: 5,
      spaceBetween: 60
    }
  }
})