var express = require('express');
var router = express.Router();

/* GET Index home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

// PAGE: Movie_list
router.get('/movie/list', function(req, res, next){
  res.render('pages/category/movie_list', { title : 'movie_list' })
})

// PAGE: Movie_detail
router.get('/movie/detail', function(req, res, next){
  res.render('pages/category/movie_detail', { title : 'movie_detail' })
})
module.exports = router;
