var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/mypage', function(req, res, next) {
  res.render('pages/mypage/dashboard')
});

module.exports = router;
