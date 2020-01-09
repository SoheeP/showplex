var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signup', function(req, res, next) {
  res.render('pages/auth/signup', { title: 'Sign up' });
});

module.exports = router;
