var express = require('express');
var router = express.Router();

// PAGE: My page
router.get('/mypage', function(req, res, next) {
  res.render('pages/mypage/dashboard')
});

// PAGE: Change one's profile
router.get('/change_profile', function(req, res, next) {
  res.render('pages/mypage/change_profile')
});

module.exports = router;
