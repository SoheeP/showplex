var express = require('express');
var axios = require('axios');
var { AxiosConfig } = require('./common');
var router = express.Router();
var convert = require('xml-js');
var request = require('request');

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
  let sortArr = ['title', 'year', 'rating', 'peers', 'seeds', 'download_count', 'like_count', 'date_added'];
  let randomSortby = sortArr[Math.floor(Math.random() * sortArr.length)];
  let randomSortbyConfig = {
    method: 'get',
    url: `https://yts.tl/api/v2/list_movies.json?sort_by=${randomSortby}&limit=15`
  }
  await axios.all([
    AxiosConfig(movieDetailConfig),
    AxiosConfig(randomSortbyConfig)
  ])
  .then(axios.spread(function(detail, randomSort){
    body.movieInfo = detail.data.data.movie;
    body.randomSort = randomSort.data.data.movies;
  }))
  body.title = 'movie_detail';
  // console.log(body, 'out body');
  res.render('pages/category/movie_detail', body)
})

// PAGE: Play_list
router.get('/play/list', async function(req, res, next){
  let body = {};
  let HOST = `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm`;
  
  // http://www.culture.go.kr/openapi/rest/publicperformancedisplays/period?from=20101118&to=20101217&cPage=1&rows=10&place=&gpsxfrom=&gpsyfrom=&gpsxto=&gpsyto=&keyword=&sortStdr=1&serviceKey=MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D
  let KEY = `MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D`;
  await axios.get(`${HOST}?requestTime=20200101&realmCode=A000&cPage=1&rows=10&place=&gpsxfrom=&gpsyfrom=&gpsxto=&gpsyto=&keyword=&sortStdr=1&${encodeURIComponent('serviceKey')}=${KEY}`
  )
  .then(function(res){
    // console.log(res.data)
    let convertJson = convert.xml2json(res.data, {compact: true, spaces: 2})
    let resObj = JSON.parse(convertJson);
    body.perforList = resObj.response.msgBody.perforList;
  })
  body.title = 'play_list';
  console.log(body.perforList[0]);
  res.render('pages/category/play_list', body)
})



// PAGE: Play_detail
router.get('/play/detail', function(req, res, next){
  res.render('pages/category/play_detail', { title : 'play_detail' })
})

module.exports = router;
