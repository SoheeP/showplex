var express = require('express');
var axios = require('axios');
var router = express.Router();

/* GET Index home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

// PAGE: Movie_list
router.get('/movie/list', function(req, res, next){
  let body = {};
  let apiUrl = `https://yts.tl/api/v2`;
  let recommendConfig = {
    method: 'get',
    url: `${apiUrl}/movie_suggestions.json?movie_id=10`
  }
  let ratedConfig = {
    method: 'get',
    url: `${apiUrl}/list_movies.json&limit=15`
  };
  axios(recommendConfig).then(function(res){
    let recommendMovieData = res.data.data.movies;
    body.recommendMovieData = recommendMovieData;
  });
  axios(ratedConfig).then(function(res){
    let ratedMovieData = res.data.data.movies;
    body.ratedMovieData = ratedMovieData;
  });
  body.title = 'movie_list'
  res.render('pages/category/movie_list', body)
})

// PAGE: Movie_detail
router.get('/movie/detail', function(req, res, next){
  res.render('pages/category/movie_detail', { title : 'movie_detail' })
})

// PAGE: Play_list
router.get('/play/list', function(req, res, next){
  res.render('pages/category/play_list', { title : 'play_list' })
  // axios({
    //   // config
    //   method: 'get',
    //   url: 'http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D',
    // }).then(function(res){
    //   console.log(res)
    // })
})



// PAGE: Play_detail
router.get('/play/detail', function(req, res, next){
  res.render('pages/category/play_detail', { title : 'play_detail' })
})

module.exports = router;
