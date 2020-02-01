const express = require('express');
const { AxiosConfig, convertTimeToKorean } = require('./common');
const { axios, xml_js, moment } = require('./npm_modules');
const router = express.Router();

/* GET Index home page. */
router.get('/', async function(req, res, next) {
  let body = {};
  let movieApiUrl = `https://yts.tl/api/v2`;
  let perforApiUrl = `http://kopis.or.kr/openApi/restful/pblprfr`;
  let perforAPiKey = `dcd5cdf9f05649a9a919e18323a8d4bc`;

  let ratedMovieConfig = {
    method: 'get',
    url: `${movieApiUrl}/list_movies.json&limit=15`
  };
  let ratedPlayConfig = {
    method: 'get',
    url: `${perforApiUrl}?service=${perforAPiKey}&stdate=20180101&eddate=20200201&cpage=1&rows=15&shcate=AAAA&prfstate=02&signgucode=11`,
  };
  let ratedMusicalConfig = {
    method: 'get',
    url: `${perforApiUrl}?service=${perforAPiKey}&stdate=20180101&eddate=20200201&cpage=1&rows=15&shcate=AAAB&prfstate=02&signgucode=11`,
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
    body.perforList = resObjPlay.dbs.db;
    body.musicalList = resObjMusical.dbs.db;
    body.title = 'index';
  }));
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
  let HOST = `http://kopis.or.kr/openApi/restful/pblprfr`;
  
  let KEY = `dcd5cdf9f05649a9a919e18323a8d4bc`;

  await axios.get(`${HOST}?service=${KEY}&stdate=20180101&eddate=20200201&cpage=1&rows=15&shcate=AAAA&prfstate=02&signgucode=11`)
  .then(function(res){
    let convertJson = xml_js.xml2json(res.data, {compact: true, spaces: 2})
    let resObj = JSON.parse(convertJson);
    body.perforList = resObj.dbs.db;
    body.title = 'play_list';
  })
  res.render('pages/category/play_list', body)
})



// PAGE: Play_detail
router.get('/play/detail/:seq', async function(req, res, next){
  let body = {};
  let play_id = req.params.seq; 
  let HOST = `http://kopis.or.kr/openApi/restful/pblprfr`
  let KEY = `dcd5cdf9f05649a9a919e18323a8d4bc`;

  let playDetailConfig = {
    method: 'get',
    url: `${HOST}/${play_id}?service=${KEY}`,
  }
  
  let randomAreaArr = [11, 26, 27, 28];
  let randomSortby = randomAreaArr[Math.floor(Math.random() * randomAreaArr.length)];
  let randomSortbyConfig = {
    method: 'get',
    url: `${HOST}?service=${KEY}&stdate=20180101&eddate=20200201&cpage=1&rows=15&shcate=AAAA&prfstate=02&signgucode=${randomSortby}`
  };
  await axios.all([
    AxiosConfig(playDetailConfig),
    AxiosConfig(randomSortbyConfig)
  ])
  .then(axios.spread(function(detail, random){
      let convertJsonDetail = xml_js.xml2json(detail.data, {
        compact: true,
        spaces: 2
      });
      let convertJsonRandom = xml_js.xml2json(random.data, {
        compact: true,
        spaces: 2
      });
      let resObjDetail = JSON.parse(convertJsonDetail);
      let resObjRandom = JSON.parse(convertJsonRandom);

      body.perforDetail = resObjDetail.dbs.db;
      body.perforRandomList = resObjRandom.dbs.db;

      body.title = 'play_detail';
      }))
    .catch(function(err){
      console.log('err:', err);
    });
    
  res.render('pages/category/play_detail', body);
});


// PAGE: Musical_list
router.get('/musical/list', async function(req, res, next){
  let body = {};
  let HOST = `http://kopis.or.kr/openApi/restful/pblprfr`;
  
  let KEY = `dcd5cdf9f05649a9a919e18323a8d4bc`;

  await axios.get(`${HOST}?service=${KEY}&stdate=20100101&eddate=20201231&cpage=1&rows=15&shcate=AAAB&prfstate=02`)
  .then(function(res){
    let convertJson = xml_js.xml2json(res.data, {compact: true, spaces: 2})
    let resObj = JSON.parse(convertJson);
    body.musicalList = resObj.dbs.db;
    body.title = 'musical_list';
  })
  res.render('pages/category/musical_list', body)
})



// PAGE: Musical_detail
router.get('/musical/detail/:seq', async function(req, res, next){
  let body = {};
  let musical_id = req.params.seq; 
  let HOST = `http://kopis.or.kr/openApi/restful/pblprfr`
  let KEY = `dcd5cdf9f05649a9a919e18323a8d4bc`;

  let musicaletailConfig = {
    method: 'get',
    url: `${HOST}/${musical_id}?service=${KEY}`,
  }
  
  let randomAreaArr = [11, 26, 27, 28];
  let randomSortby = randomAreaArr[Math.floor(Math.random() * randomAreaArr.length)];
  let randomSortbyConfig = {
    method: 'get',
    url: `${HOST}?service=${KEY}&stdate=20180101&eddate=20200201&cpage=1&rows=15&shcate=AAAB&prfstate=02&signgucode=${randomSortby}`
  };
  console.log(`local:: ${randomSortby}`)
  await axios.all([
    AxiosConfig(musicaletailConfig),
    AxiosConfig(randomSortbyConfig)
  ])
  .then(axios.spread(function(detail, random){
      let convertJsonDetail = xml_js.xml2json(detail.data, {
        compact: true,
        spaces: 2
      });
      let convertJsonRandom = xml_js.xml2json(random.data, {
        compact: true,
        spaces: 2
      });
      let resObjDetail = JSON.parse(convertJsonDetail);
      let resObjRandom = JSON.parse(convertJsonRandom);

      body.musicalDetail = resObjDetail.dbs.db;
      body.musicalRandomList = resObjRandom.dbs.db;

      body.title = 'musical_detail';
      }))
    .catch(function(err){
      console.log('err:', err);
    });
    
    console.log(body.musicalDetail)
  res.render('pages/category/musical_detail', body);
});

module.exports = router;
