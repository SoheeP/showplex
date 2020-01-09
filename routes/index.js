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

// PAGE: Play_list
router.get('/play/list', function(req, res, next){
  res.render('pages/category/play_list', { title : 'play_list' })
})

// PAGE: Play_detail
router.get('/play/detail', function(req, res, next){
  res.render('pages/category/play_detail', { title : 'play_detail' })
})

module.exports = router;
