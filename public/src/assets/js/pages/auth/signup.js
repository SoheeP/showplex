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
 passwordRuleReg   = /^(?=.*[a-zA-Z])(?=.*[0-9]).{4,16}$/;

//Bootstrap tooltip
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

function checkpasswordReg (value){
  if(!passwordRuleReg.test(value)){
    alertMessage[0].innerHTML = "영문, 숫자 조합으로 4자~16자 이상으로 설정할 수 있습니다.";
    return false;
  } else {
    return true;
  }
}

let currentPassword ;
password.addEventListener('blur', (e)=>{
  currentPassword = e.currentTarget.value;
})
checkPassword.addEventListener('blur', (e)=>{
  if (currentPassword === e.currentTarget.value) {
    if (checkpasswordReg(currentPassword) && checkpasswordReg(e.currentTarget.value)) {
      common.changeClass(alertMessage[0], 'alert-danger', 'alert-primary')
      alertMessage[0].innerHTML = "사용할 수 있는 비밀번호입니다.";
    }
  } else if (currentPassword !== e.currentTarget.value){
    common.changeClass(alertMessage[0], 'alert-primary', 'alert-danger')
    alertMessage[0].innerHTML = "비밀번호가 일치하지 않습니다.";
  } else if (currentPassword === '' || e.currentTarget.value === ''){
    common.changeClass(alertMessage[0], 'alert-primary', 'alert-danger')
    alertMessage[0].innerHTML = "비밀번호 입력을 확인해주세요."
  }
});

username.addEventListener("blur", (e)=>{
  let nameReg = /^[가-힣a-zA-Z]+$/;
  console.log(`${e.target.value}, \n result: ${nameReg.test(e.target.value)}`)
  if(!nameReg.test(e.target.value)){
    //포함되지 않았을 때
    common.changeClass(alertMessage[1], 'alert-primary', 'alert-danger');
    alertMessage[1].innerHTML = '이름에는 한글, 영어 대소문자만 가능합니다.'
  } else {
    common.changeClass(alertMessage[1], 'alert-danger', 'alert-primary');
    alertMessage[1].innerHTML = '사용할 수 있는 이름입니다.'
  }
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
    if (checkpasswordReg(password.value) && checkpasswordReg(checkPassword.value)) {
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
      alert('비밀번호에 사용가능한 문자를 확인해주세요.')
    };
  } else {
    alert('비밀번호를 확인해주세요.')

  }
});