let signinForm = common.elm('.signin__form'),
email          = common.elm('#email'),
password       = common.elm('#password'),
button         = common.elm('.signin__button-login'),
prevUrl        = button.getAttribute('data-prev');

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