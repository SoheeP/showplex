let signinForm = common.elm('.signin__form'),
email          = common.elm('#email'),
password       = common.elm('#password');

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
      // 로그인 성공
      window.location.href = '/';
    }
  })
})