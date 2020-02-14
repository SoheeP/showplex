const express = require('express');
const router = express.Router();
const { isLogged, wrap } = require('./middlewares');
const { AxiosConfig, AxiosWithDB } = require('./common');

// PAGE: My page
router.route('/mypage')
.get(isLogged, async (req, res, next) => {
  let body = {};
  let usernum = req.session.user.usernum;
  let logConfig = {
    url: `/users/mypage?user=${usernum}`
  }
  await AxiosWithDB(logConfig, (response) => {
    let { data } = response;
    body.logData = data.log;
    console.log(body.logData);
  })
  res.render('pages/mypage/dashboard', body)
});

// PAGE: Change one's profile
router.route('/change_profile').get(isLogged, (req, res, next) => {
  /*
  { usernum: 1,
  email: 'abc@email.com',
  username: 'P',
  verify: null,
  result: 1 }

  */
  let body = {};
  body.userData = req.session.user;
  console.log(req.session.user);
  res.render('pages/mypage/change_profile', body)
});

router.route('/profile/change').post(isLogged, (req, res, next) => {
  let usernum = req.session.user.usernum,
  password = req.body.password,
  username = req.body.username,
  phone = req.body.phone;
  console.log(password, username, phone, 'Want Change!!');

  const changeConfig = {
    url: `/users/profile/change`,
    method: 'post',
    data: {
      usernum: usernum,
      password: password,
      username: username,
      phone: phone,
    }
  }

  AxiosWithDB(changeConfig, (response) => {
    let { data } = response;
    if(data.result === 1){
      res.json({ result: 1 });
    }
  })
})

module.exports = router;
