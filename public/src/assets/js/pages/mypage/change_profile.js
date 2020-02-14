let profileForm = common.elm('.profile__form'),
password        = common.elm('#password'),
username        = common.elm('#username'),
phone           = common.elm('#phoneNumber');

profileForm.addEventListener("submit", (e) => {
  e.preventDefault();
  console.log("submit!");
  const changeConfig = {
    url: '/users/profile/change',
    method: 'post',
    data: {
      passowrd: password.value,
      username: username.value,
      phone: phone.value
    }
  }
  axios(changeConfig).then((response) => {
    let { data } = response;
    console.log(data)
  })
})