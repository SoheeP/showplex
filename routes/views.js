var express = require('express');
var router = express.Router();


// view - FAQ와 같은 정말로 보여지기만 하는 페이지
/* GET home page. */
router.get('/faq', function(req, res, next) {
  res.render('pages/view_pages/faq', { title: 'Express' });
});

router.get('/about', (req, res, next) => {
  res.render('pages/view_pages/about')
})

module.exports = router;