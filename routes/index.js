var express = require('express');
var axios = require('axios');
var { AxiosConfig } = require('./common');
var router = express.Router();

/* GET Index home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'index' });
});

// PAGE: Movie_list
router.get('/movie/list', async function(req, res, next){
  let body = {};
  let apiUrl = `https://yts.tl/api/v2`;
  let ratedConfig = {
    method: 'get',
    url: `${apiUrl}/list_movies.json&limit=15`
  };
  let recommendConfig = {
    method: 'get',
    url: `${apiUrl}/movie_suggestions.json?movie_id=10`
  }
  await axios.all([
    AxiosConfig(ratedConfig), 
    AxiosConfig(recommendConfig)
  ])
  .then(axios.spread(function(rated, recommend){
    body.ratedMovieData = rated.data.data.movies;
    body.recommendMovieData = recommend.data.data.movies;
  }))
  body.title = 'movie_list';
  res.render('pages/category/movie_list', body)
})

// PAGE: Movie_detail
router.get('/movie/detail/:seq', async function(req, res, next){
  let body = {};
  let movie_id = req.params.seq;
  let movieDetailConfig = {
    method: 'get',
    url: `https://yts.tl/api/v2/movie_details.json?movie_id=${movie_id}`
  }
  await axios(movieDetailConfig).then(function(res){
    body.movieInfo = res.data.data.movie;
  }).catch(function(err){
    console.log(`error: ${err}`)
  })
  body.title = 'movie_detail'
  console.log(body, "DEEEEEEEEEEEEEETail");
  res.render('pages/category/movie_detail', body)
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
