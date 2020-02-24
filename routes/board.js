const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
} = require('./common');
const { moment } = require('./npm_modules');
const { isLogged, wrap } = require('./middlewares');

router.get('/freeboard', (req, res, next)=>{
  req.session.prevUrl = req.originalUrl;
  let boardListConfig = {
    url: `/board/freeboard`,
    method: 'get'
  }
  AxiosWithDB(boardListConfig, (response)=> {
    let body = {
      list: response.data
    };
    for(let key in body){
      if(key === 'list'){
        body[key].map(list => {
          let time = list.time;
          list.time = moment(time).format('YYYY-MM-DD');
        });
      };
    };
    body.title = 'Free board';
    res.render('pages/board/freeboard', body)
  });
});

// PAGE: detail page
router.get('/freeboard/detail/:seq', (req, res, next) => {
  let id = req.params.seq;
  let body = {};
  let freeboardDetailConfig = {
    url: '/board/detail',
    method: 'get',
    data: {
      id
    }
  };

  AxiosWithDB(freeboardDetailConfig, (response) => {
    body.boardDetail = response.data;
    body.title = response.data.title
    res.render('pages/board/detail', body);
  })
})

// PAGE: Write
router.route('/freeboard/write')
.get(isLogged, (req, res, next) => {
  req.session.prevUrl = req.originalUrl;
  res.render('pages/board/write', {title: 'Free Board' })
})
.post(isLogged, (req, res, next) => {

  let username = req.session.user.username,
  title = req.body.title,
  contents = req.body.contents;
  
  let writeConfig = {
    method: 'post',
    url: '/board/write',
    data: {
      username: username,
      title: title,
      contents: contents
    }
  }
  AxiosWithDB(writeConfig, (response) => {
    let { data } = response;
    if(data.result === 1){
      res.json({ result: 1 });
    } else if(data.result === 2){
      res.json({ result: 2 });
    };
  })
})

module.exports = router;
