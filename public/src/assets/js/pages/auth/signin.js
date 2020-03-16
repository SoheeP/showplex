let signinForm = common.elm('.signin__form'),
email          = common.elm('#email'),
password       = common.elm('#password'),
button         = common.elm('.signin__button-login'),
prevUrl        = button.getAttribute('data-prev');


//body 사이즈 계산
(() => {
  let footerOffsetHeight = document.querySelector('.footer').offsetHeight;
  let footerRealHeight = +footerOffsetHeight + 120;
  let containerHeight = document.querySelectorAll('.container-fluid')[0].offsetHeight;
  let gap = window.innerHeight - containerHeight;
  if (+gap > footerRealHeight) {
    document.querySelector('.footer__parent').classList.add('footer__bottom')
  }
})();

signinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const signinConfig = {
    method: 'post',
    url: '/auth/signin',
    data: {
      email: email.value,
      password: password.value
    }
  };
  axios(signinConfig).then((response) => {
    let { data } = response;
    if(data.result === 2){
      alert('이메일이나 패스워드를 확인해주세요.')
    } else {
      // 로그인 성공 시 이전 페이지로 이동
      if(prevUrl === ''){
        window.location.href = "/";
      } else {
        window.location.href= prevUrl;
      }
    }
  })
});