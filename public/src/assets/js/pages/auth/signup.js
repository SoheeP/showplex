let signupForm     = common.elm('.signup__form'),
 email             = common.elm('#email'),
 password          = common.elm('#password'),
 checkPassword     = common.elm('#checkPassword'),
 username          = common.elm('#username'),
 phone             = common.elm('#phoneNumber'),
 captchaData       = common.elm('.captcha__data'),
 captchaRefreshBtn = common.elm('.signup__button-refresh'),
 captchaValue      = common.elm('#captcha');



// click captcha

captchaRefreshBtn.addEventListener('click', () => {
  const captchaConfig = {
    url: '/auth/captcha',
    method: 'get',
  }
  axios(captchaConfig).then((response) => {
    let { data } = response;
    captchaData.innerHTML = data.captcha.data;
  });
});

// submit
signupForm.addEventListener('submit', function(e){
  e.preventDefault();
  console.log('submit!');
  const signupConfig = {
    // router address
    url: '/auth/signup',
    method: 'post',
    data: {
      email: email.value,
      password: password.value,
      username: username.value,
      phone: phone.value,
      captcha: captchaValue.value,
    }
  };
  axios(signupConfig).then((response) => {
    let { data } = response;
    if(data.result === 1 ){
      alert('회원가입을 축하합니다. 확인 버튼을 누르면 로그인 페이지로 이동합니다.');
      window.location.href = '/auth/signin';
    } else if(data.result === 4 ){
      alert('이미 가입한 이메일 주소입니다.')
    } else if(data.result === 8){
      alert('자동가입방지 문자를 확인해주세요.')
    };
  });
});