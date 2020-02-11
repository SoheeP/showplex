const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
  createSvgCaptcha
} = require('./common');
const { uuid4 } = require('./npm_modules');


// NOTE: Create Captcha

router.route('/captcha')
.get(async (req, res, next) => {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  res.json(body);
})

// PAGE: Sign up
router.route('/signup')
.get(async (req, res, next) => {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  console.log(req.session, 'session')
  req.session.captcha = captcha.text;
  res.render('pages/auth/signup', body);
})
.post((req, res, next) => {
  let email    = req.body.email,
  password     = req.body.password,
  username     = req.body.username,
  phone        = req.body.phone;
  verifyNumber = req.body.captcha;
  console.log(req.session.captcha, 'capcha session')
  if(req.session.captcha === verifyNumber){
    const signupConfig = {
      // DB router
      url: `/auth/signup`,
      method: 'post',
      data: {
        email: email,
        password: password,
        username: username,
        phone: phone, 
        verifyNumber: verifyNumber
      }
    }
    AxiosWithDB(signupConfig, (response) => {
      let { data } = response ;
      console.log(data);
      if(data.result === 1){
        res.json({ result: 1 });
      }
    })
  } else {
    // check out the captcha number
    res.json({ result: 8 })
  };
});


router.route('/signin')
.get((req, res, next) => {
  res.render('pages/auth/signin', { title: 'Sign in' });
})
.post((req, res, next) => {

  let email = req.body.email,
   password = req.body.password;
  
  let signinConfig = {
    method: 'post',
    url: '/auth/signin',
    data: {
      email: email,
      password: password
    }
  };

  AxiosWithDB(signinConfig, (response) => {
    let data = response.data;
    console.log(data)
    if(data.result === 1){
      req.session.user = data;
      console.log(req.session, 'session');
      res.redirect('/')
    } else if(data.result === 2){
      alert('아이디나 패스워드가 틀렸습니다.');
      res.redirect('/auth/signin');
    }
  })
  

});

module.exports = router;
