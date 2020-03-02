let signupForm     = common.elm('.signup__form'),
 email             = common.elm('#email'),
 password          = common.elm('#password'),
 checkPassword     = common.elm('#checkPassword'),
 alertMessage      = common.elm('.alert'),
 username          = common.elm('#username'),
 phone             = common.elm('#phoneNumber'),
 captchaData       = common.elm('.captcha__data'),
 captchaRefreshBtn = common.elm('.signup__button-refresh'),
 captchaValue      = common.elm('#captcha'),
 passwordRuleReg   = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;


function isSamePassword (prevValue, currentvalue){
  if(prevValue === '' || currentvalue === ''){
    alertMessage.classList.remove('hide');
    alertMessage.classList.add('show');
    alertMessage.innerHTML = '둘 중 입력되지 않은 값이 있습니다.'
  } else {
    if(prevValue !== currentvalue){
    alertMessage.classList.remove('hide');
    alertMessage.classList.add('show');
    alertMessage.innerHTML = "패스워드가 일치하지 않습니다."
    } else {
      if(checkpasswordReg(prevValue) && checkpasswordReg(currentvalue)){
        alertMessage.classList.remove('show');
        alertMessage.classList.add('hide');
      }
    }
  }
};

function checkpasswordReg (value){
  if(!passwordRuleReg.test(value)){
    alertMessage.innerHTML = "영문, 숫자 조합으로 8자~16자 이상으로 설정할 수 있습니다."
  };
}

let currentPassword ;
password.addEventListener('blur', (e)=>{
  currentPassword = e.currentTarget.value;
})
checkPassword.addEventListener('blur', (e)=>{
  isSamePassword(currentPassword, e.currentTarget.value)
})

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
signupForm.addEventListener('submit', function (e) {
  e.preventDefault();
  if (password.value === checkPassword.value) {
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
      let {
        data
      } = response;
      if (data.result === 1) {
        alert('회원가입을 축하합니다. 확인 버튼을 누르면 로그인 페이지로 이동합니다.');
        window.location.href = '/auth/signin';
      } else if (data.result === 4) {
        alert('이미 가입한 이메일 주소입니다.')
      } else if (data.result === 8) {
        alert('자동가입방지 문자를 확인해주세요.')
      };
    });
  } else {
    alert('패스워드를 확인해주세요.')
  };
});