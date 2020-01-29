const express = require('express');
const { AxiosConfig, convertTimeToKorean } = require('./common');
const { axios, xml_js, moment } = require('./npm_modules');
const router = express.Router();

/* GET Index home page. */
router.get('/', async function(req, res, next) {
  let body = {};
  let apiUrl = `https://yts.tl/api/v2`;
  let ratedMovieConfig = {
    method: 'get',
    url: `${apiUrl}/list_movies.json&limit=15`
  };
  let ratedPlayConfig = {
    method: 'get',
    url: `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?requestTime=20200101&realmCode=A000&cPage=1&rows=10&place=&gpsxfrom=&gpsyfrom=&gpsxto=&gpsyto=&keyword=&sortStdr=1&${encodeURIComponent('serviceKey')}=MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D`,
  }
  let ratedMusicalConfig = {
    method: 'get',
    url: `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm?requestTime=20200101&realmCode=B000&cPage=1&rows=10&place=&gpsxfrom=&gpsyfrom=&gpsxto=&gpsyto=&keyword=&sortStdr=1&${encodeURIComponent('serviceKey')}=MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D`,
  }

  await axios.all([
    AxiosConfig(ratedMovieConfig),
    AxiosConfig(ratedPlayConfig),
    AxiosConfig(ratedMusicalConfig)
  ])
  .then(axios.spread(function(movie, play, musical){
    let convertJsonPlay = xml_js.xml2json(play.data, {compact: true, spaces: 2})
    let resObjPlay = JSON.parse(convertJsonPlay);
    let convertJsonMusical = xml_js.xml2json(musical.data, {compact: true, spaces: 2})
    let resObjMusical = JSON.parse(convertJsonMusical);

    body.ratedMovieData = movie.data.data.movies;
    body.perforList = resObjPlay.response.msgBody.perforList;
    body.musicalList = resObjMusical.response.msgBody.perforList;
    body.title = 'index';
  }))
  console.log(body.musicalList)
  res.render('index', body);
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
    body.title = 'movie_list';
  }))
  res.render('pages/category/movie_list', body)
})

// PAGE: Movie_detail
router.get('/movie/detail/:id', async function(req, res, next){
  let body = {};
  let movie_id = req.params.id;
  let movieDetailConfig = {
    method: 'get',
    url: `https://yts.tl/api/v2/movie_details.json?movie_id=${movie_id}`
  };
  let sortArr = ['title', 'year', 'rating', 'peers', 'seeds', 'download_count', 'like_count', 'date_added'];
  let randomSortby = sortArr[Math.floor(Math.random() * sortArr.length)];
  let randomSortbyConfig = {
    method: 'get',
    url: `https://yts.tl/api/v2/list_movies.json?sort_by=${randomSortby}&limit=15`
  };
  await axios.all([
    AxiosConfig(movieDetailConfig),
    AxiosConfig(randomSortbyConfig)
  ])
  .then(axios.spread(function(detail, randomSort){
    body.movieInfo = detail.data.data.movie;
    body.randomSort = randomSort.data.data.movies;
    body.title = 'movie_detail';
  }))
  .catch(function(err){
    console.log('err:', err);
  });
  res.render('pages/category/movie_detail', body);
})

// PAGE: Play_list
router.get('/play/list', async function(req, res, next){
  let body = {};
  let HOST = `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/realm`;
  
  let KEY = `MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D`;

  await axios.get(`${HOST}?requestTime=20200101&realmCode=A000&cPage=1&rows=10&place=&gpsxfrom=&gpsyfrom=&gpsxto=&gpsyto=&keyword=&sortStdr=1&${encodeURIComponent('serviceKey')}=${KEY}`
  )
  .then(function(res){
    let convertJson = xml_js.xml2json(res.data, {compact: true, spaces: 2})
    let resObj = JSON.parse(convertJson);
    body.perforList = resObj.response.msgBody.perforList;
    body.title = 'play_list';
  })
  res.render('pages/category/play_list', body)
})



// PAGE: Play_detail
router.get('/play/detail/:seq', async function(req, res, next){
  let body = {};
  let play_id = req.params.seq; 
  let HOST = `http://www.culture.go.kr/openapi/rest/publicperformancedisplays/d/`;

  let KEY = `MJd01k6JuHDKC6itg7A722SgdBKTKKnqXWo48ZZxWnNHPy4s6ODfypjmdUEwPRBqzzT6z5zUGrk1TSY2zdmjjw%3D%3D`;

  await axios.get(`${HOST}?seq=${play_id}&${encodeURIComponent('serviceKey')}=${KEY}`
  )
  .then(function(res){

      let convertJson = xml_js.xml2json(res.data, {
        compact: true,
        spaces: 2
      });
      let resObj = JSON.parse(convertJson);
      body.perforDetail = resObj.response.msgBody.perforInfo;
      let startDate = convertTimeToKorean(body.perforDetail.startDate._text);
      let endDate = convertTimeToKorean(body.perforDetail.endDate._text);
      body.perforDetail.startDate._text = startDate;
      body.perforDetail.endDate._text = endDate
      body.title = 'play_detail';
    })
    .catch(function(err){
      console.log('err:', err);
    });
    
    console.log(body.perforDetail)
  res.render('pages/category/play_detail', body);
});

module.exports = router;
