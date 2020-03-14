let profileForm = common.elm('.profile__form'),
password        = common.elm('#password'),
checkPassword   = common.elm('#checkPassword'),
username        = common.elm('#username'),
phone           = common.elm('#phoneNumber'),
withdrawalBtn   = common.elm('.withdrawal');

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("submit!");
  const changeConfig = {
    url: '/users/profile/change',
    method: 'post',
    data: {
      password: password.value,
      username: username.value,
      phone: phone.value
    }
  }
  axios(changeConfig).then((response) => {
    let { data } = response;
    console.log(data)
    alert('요청하신 정보가 수정되었습니다!');
    window.location.href= '/users/change_profile';
  });
});

withdrawalBtn.addEventListener("click", (e) =>{
  e.preventDefault();
  let userConfirm = confirm('탈퇴하시겠습니까?');
  if(userConfirm){
  const withdrawalConfig = {
    url: '/auth/withdrawal',
    method: 'post'
  }
  axios(withdrawalConfig).then((response)=>{
    let { data } = response;
    if(data.result === 1){
      alert('회원 탈퇴가 정상처리 되었습니다.');
      window.location.href = "/";
    } else if(data.result === 2){
      alert('처리중 문제가 생겼습니다.')
    }
  })}
})