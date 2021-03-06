const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
  createSvgCaptcha
} = require('./common');
const { wrap } = require('./middlewares');
const crypto = require('crypto');
const saltKey = crypto.createHash('sha512').digest('base64');

// NOTE: Create Captcha

router.route('/captcha')
.get(wrap(async (req, res, next) => {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  console.log(req.session.captcha);
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
  let { email, password, username, phone, captcha } = req.body;
  console.log(`captchaValue = ${captcha}`);
  
  let hashPassword = crypto.pbkdf2Sync(password, saltKey, 1514578, 64, 'sha512').toString('base64');
  
  console.log(hashPassword, 'hash')
  if (req.session.captcha === captcha) {
    const signupConfig = {
      // DB router
      url: `/auth/signup`,
      method: 'post',
      data: {
        email,
        hashPassword,
        username,
        phone,
        captcha
      }
    };
    AxiosWithDB(signupConfig, (response) => {
      let { data } = response;
      if (data.result === 1) {
        //성공
        res.json({ result: 1 });
      } else if (data.result === 4) {
        //중복
        res.json({ result: 4 });
      };
    });
  } else {
    // check out the captcha number
    res.json({ result: 8 });
  };
}));


router.route('/signin')
.get(wrap((req, res, next) => {
  res.render('pages/auth/signin', { title: 'Sign in' });
}))
.post(wrap((req, res, next) => {

  let { email, password } = req.body;
  
  let hashPassword = crypto.pbkdf2Sync(password, saltKey, 1514578, 64, 'sha512').toString('base64');

  let signinConfig = {
    method: 'post',
    url: '/auth/signin',
    data: {
      email,
      hashPassword
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
}));

router.route('/withdrawal')
.post(wrap((req, res, next) => {
  let { usernum } = req.session.user;
  let withdrawalConfig = {
    url: '/auth/withdrawal',
    method: 'post',
    data: {
      usernum
    }
  };
  AxiosWithDB(withdrawalConfig, (response) => {
    let { data } = response;
    if (data.result === 1) {
      if (req.session) {
        req.session.destroy((err) => {
          if (err) {
            console.log(`Error: session delete`);
            return;
          }
          console.log('Success: session delete');
          res.json({ result: 1 })
        })
      } else {
        res.json({ result: 2 })
      }
    }
  })
}));

module.exports = router;
