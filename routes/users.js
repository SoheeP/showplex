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
  console.log(res.locals.loginData, 'res.locals');
  res.render('pages/mypage/dashboard', body)
});

// PAGE: Change one's profile
router.route('/change_profile').get(isLogged, wrap(async (req, res, next) => {
  let body = {};
  body.userData = req.session.user;
  console.log(req.session.user, 'req');
  console.log(res.locals.loginData, 'res.locals');
  res.render('pages/mypage/change_profile', body)
}));

router.route('/profile/change').post(isLogged, (req, res, next) => {
  let usernum = req.session.user.usernum,
  password = req.body.password,
  username = req.body.username,
  phone = req.body.phone;
  console.log(password, username, phone, 'Want Change!!');
  console.log(req.body, 'body');
  let { ...reqBody } = req.body;

  let data = {
    usernum: usernum
  };
  for(let key in reqBody){
    if(reqBody[key] === '' || reqBody[key] === null){
      console.log(`${data}`)
    } else {
      data[key] = reqBody[key];
    }
  }
  console.log(data, 'dataOVJ');

   const changeConfig = {
    url: `/users/profile/change`,
    method: 'post',
    data: data
  }

  AxiosWithDB(changeConfig, (response) => {
    let { data } = response;
    if(data.result === 1){
      res.json({ result: 1 });
    }
  });
  console.log(req.session.user, 'req');
  console.log(res.locals.loginData, 'res')
})

module.exports = router;
