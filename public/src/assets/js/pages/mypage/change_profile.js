let profileForm = common.elm('.profile__form'),
password        = common.elm('#password'),
checkPassword   = common.elm('#checkPassword'),
username        = common.elm('#username'),
phone           = common.elm('#phoneNumber');

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
    
  });
});