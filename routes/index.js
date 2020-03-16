const express = require('express');
const { AxiosWithDB, convertXmlToJson } = require('./common');
const { axios, moment } = require('./npm_modules');
const { wrap } = require('./middlewares');
const router = express.Router();

/* GET Index home page. */
router.get('/', async function(req, res, next) {
  req.session.prevUrl = req.originalUrl;
  let body = {};

  let ratedMovieConfig = {
    method: 'get',
    url: `/movie/list?limit=15`
  };
  let ratedPlayConfig = {
    method: 'get',
    url: `/play/list?cpage=1&signgucode=11`,
  };
  let ratedMusicalConfig = {
    method: 'get',
    url: `/musical/list?cpage=1&signgucode=11`,
  }

  await axios.all([
    AxiosWithDB(ratedMovieConfig),
    AxiosWithDB(ratedPlayConfig),
    AxiosWithDB(ratedMusicalConfig)
  ])
  .then(axios.spread((movie, play, musical) => {
    let playList = convertXmlToJson(play.data);
    let musicalList = convertXmlToJson(musical.data);

    body.ratedMovieData = movie.data.data.movies;
    body.perforList = playList.dbs.db;
    body.musicalList = musicalList.dbs.db;
    body.title = 'index';
  }));
  res.render('index', body);
});

// PAGE: Movie_list
router.get('/movie/list', async function(req, res, next){
  req.session.prevUrl = req.originalUrl;
  let body = {};
  let ratedConfig = {
    method: 'get',
    url: `/movie/list?limit=15`
  };
  let recommendConfig = {
    method: 'get',
    url: `/movie/suggestion?movie_id=10`
  }

  await axios.all([
    AxiosWithDB(ratedConfig),
    AxiosWithDB(recommendConfig),
  ])
  .then(axios.spread((rated, recommend) => {
    body.ratedMovieData = rated.data.data.movies;
    body.recommendMovieData = recommend.data.data.movies;
    body.title = 'movie_list';
  }))

  res.render('pages/category/movie_list', body)
})

// PAGE: Movie_detail
router.get('/movie/detail/:id', async function(req, res, next){
  req.session.prevUrl = req.originalUrl;
  let body = {};
  let movie_id = req.params.id;
  let movieDetailConfig = {
    method: 'get',
    url: `/movie/detail?movie_id=${movie_id}`
  };

  let sortArr = ['title', 'year', 'rating', 'peers', 'seeds', 'download_count', 'like_count', 'date_added'];
  let randomSortby = sortArr[Math.floor(Math.random() * sortArr.length)];

  let randomSortbyConfig = {
    method: 'get',
    url: `/movie/list?sort_by=${randomSortby}&limit=15`
  };
  await axios.all([
    AxiosWithDB(movieDetailConfig),
    AxiosWithDB(randomSortbyConfig)
  ])
  .then(axios.spread((detail, randomSort) => {
    body.movieInfo = detail.data.data.movie;
    body.randomSort = randomSort.data.data.movies;
    body.title = 'movie_detail';
  }))
  res.render('pages/category/movie_detail', body);
})

// PAGE: Play_list
router.get('/play/list', async function(req, res, next){
  req.session.prevUrl = req.originalUrl;
  let body = {};

  let playListConfig = {
    method: 'get',
    url: '/play/list?cpage=1&signgucode=11'
  };

  let recommendConfig = {
    method: 'get',
    url: '/play/list?cpage=3&signgucode=11'
  }
  await axios.all([
    AxiosWithDB(playListConfig),
    AxiosWithDB(recommendConfig)
  ])
  .then(axios.spread((list, recommend )=>{
    let playList = convertXmlToJson(list.data);
    let recommendList = convertXmlToJson(recommend.data);

    body.perforList = playList.dbs.db;
    body.recommendList = recommendList.dbs.db;

    body.title = 'play_list';
  }));
  res.render('pages/category/play_list', body)
})



// PAGE: Play_detail
router.get('/play/detail/:seq', async function (req, res, next) {
  req.session.prevUrl = req.originalUrl;
  let body = {};
  let id = req.params.seq;

  let playDetailConfig = {
    method: 'get',
    url: `/play/detail`,
    data: { id }
  }

  let randomAreaArr = [11, 26, 27, 28];
  let randomSortby = randomAreaArr[Math.floor(Math.random() * randomAreaArr.length)];

  let randomSortbyConfig = {
    method: 'get',
    url: `/play/list?cpage=1&signgucode=${randomSortby}`
  };
  await axios.all([
    AxiosWithDB(playDetailConfig),
    AxiosWithDB(randomSortbyConfig)
  ])
  .then(axios.spread((detail, random) => {
    let playDetail = convertXmlToJson(detail.data);
    let randomSort = convertXmlToJson(random.data);
    
    body.perforDetail = playDetail.dbs.db;
    body.perforRandomList = randomSort.dbs.db;
    body.title = 'play_detail';
  }))
  .catch(function (err) {
    console.log('err:', err);
  });
  res.render('pages/category/play_detail', body);
});


// PAGE: Musical_list
router.get('/musical/list', async function(req, res, next){
  req.session.prevUrl = req.originalUrl;
  let body = {};
  let musicalListConfig = {
    method: 'get',
    url: '/musical/list?cpage=1&signgucode=11'
  }
  let recommendConfig = {
    method: 'get',
    url: '/musical/list?cpage=2&signgucode=11'
  }

  await axios.all([
    AxiosWithDB(musicalListConfig),
    AxiosWithDB(recommendConfig)
  ])
  .then(axios.spread((list, recommend )=>{
    let musicalList = convertXmlToJson(list.data);
    let recommendList = convertXmlToJson(recommend.data);

    body.musicalList = musicalList.dbs.db;
    body.recommendList = recommendList.dbs.db;
    
    body.title = 'musical_list';
  }));
  res.render('pages/category/musical_list', body)
})



// PAGE: Musical_detail
router.get('/musical/detail/:seq', async function(req, res, next){
  req.session.prevUrl = req.originalUrl;
  let body = {};
  let id = req.params.seq; 

  let musicaletailConfig = {
    method: 'get',
    url: '/musical/detail',
    data: { id }
  }
  
  let randomAreaArr = [11, 26, 27, 28];
  let randomSortby = randomAreaArr[Math.floor(Math.random() * randomAreaArr.length)];
  let randomSortbyConfig = {
    method: 'get',
    url: `/musical/list?cpage=1&signgucode=${randomSortby}`
  };
  
  await axios.all([
    AxiosWithDB(musicaletailConfig),
    AxiosWithDB(randomSortbyConfig)
  ])
  .then(axios.spread(function(detail, random){
    let musicalDetail = convertXmlToJson(detail.data);
    let randomSort = convertXmlToJson(random.data);
    body.musicalDetail = musicalDetail.dbs.db;
    body.musicalRandomList = randomSort.dbs.db;
    body.title = 'musical_detail';
    }))
  .catch(function(err){
    console.log('err:', err);
  });
  res.render('pages/category/musical_detail', body);
});

module.exports = router;
