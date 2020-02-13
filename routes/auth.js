const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
  createSvgCaptcha
} = require('./common');
const { wrap } = require('./middlewares');
const { uuid4 } = require('./npm_modules');


// NOTE: Create Captcha

router.route('/captcha')
.get(wrap(async (req, res, next) => {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  res.json(body);
}))

// PAGE: Sign up
router.route('/signup')
.get(wrap(async (req, res, next) => {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  res.render('pages/auth/signup', body);
}))
.post(wrap((req, res, next) => {
  let email    = req.body.email,
  password     = req.body.password,
  username     = req.body.username,
  phone        = req.body.phone;
  verifyNumber = req.body.captcha;

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
      if(data.result === 1){
        res.json({ result: 1 });
      }
    })
  } else {
    // check out the captcha number
    res.json({ result: 8 })
  };
}));


router.route('/signin')
.get(wrap((req, res, next) => {
  res.render('pages/auth/signin', { title: 'Sign in' });
}))
.post(wrap((req, res, next) => {

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
      res.json({ result: 1 })
    } else if(data.result === 2){
      res.json({ result: 2 })
    }
  })
}));

router.route('/signout')
.get(wrap((req, res, next) => {
  if (req.session){
    req.session.destroy((err) => {
      if(err){
        console.log(`Error: session delete`);
        return;
      }
      console.log('Success: session delete');
      res.redirect('/');
    });
  } else {
    console.log('No any stored session');
  }
}))

module.exports = router;
