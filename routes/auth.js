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
.get(function(req, res, next) {
  let captcha = createSvgCaptcha();
  let body = {};
  body.captcha = captcha;
  req.session.captcha = captcha.text;
  res.render('pages/auth/signup', body);
}).post


router.get('/signin', function(req, res, next) {
  res.render('pages/auth/signin', { title: 'Sign in' });
});

module.exports = router;
