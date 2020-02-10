const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
  createSvgCaptcha
} = require('./common');
const { uuid4 } = require('./npm_modules');

// PAGE: Sign up
router.route('/signup')
.get(async function(req, res, next) {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  res.render('pages/auth/signup', body);
})
.post(function(req, res, next){
  let email    = req.body.email,
  password     = req.body.password,
  username     = req.body.username,
  phone        = req.body.phone,
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
        phone: phone
      }
    }
    AxiosWithDB(signupConfig, (response) => {
      let { data } = response ;
      console.log(data)
    })
  };
});


router.get('/signin', function(req, res, next) {
  res.render('pages/auth/signin', { title: 'Sign in' });
});

module.exports = router;
