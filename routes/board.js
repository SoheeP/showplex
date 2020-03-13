const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
} = require('./common');
const { moment } = require('./npm_modules');
const { isLogged, wrap } = require('./middlewares');

router.get('/freeboard/list/:page', (req, res, next)=>{
  req.session.prevUrl = req.originalUrl;
  const page = req.params.page;
  const itemCnt = 10;
  let body = {};
  
  let boardListConfig = {
    url: `/board/freeboard`,
    method: 'get',
    data: {
      page,
      itemCnt
    }
  }
  AxiosWithDB(boardListConfig, (response)=> {
    let { list, pageData } = response.data;
    body.list = list;
    body.pageData = pageData;

    for(let key in body){
      if(key === 'list'){
        body[key].map(list => {
          let time = list.time;
          list.time = moment(time).format('YYYY-MM-DD');
        });
      };
    };
    body.title = 'Free board';
    console.log(body);
    res.render('pages/board/freeboard', body)
  });
});

// PAGE: detail page
router.get('/freeboard/detail/:seq', (req, res, next) => {
  req.session.prevUrl = req.originalUrl;
  let id = +req.params.seq;
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
    body.title = response.data.title;
    body.boardDetail.id = +id;
    res.render('pages/board/detail', body);
  })
})

router.post('/freeboard/detail/delete', (req, res, next) => {
  let { id } = req.body;
  let { usernum } = req.session.user;
  console.log(id);
  let deleteConfig = {
    url: '/board/delete',
    method: 'post',
    data: {
      id: +id,
      usernum
    }
  };
  
  AxiosWithDB(deleteConfig, (response) => {
    let { data } = response;
    console.log(data);
    if (data.result === 1) {
      res.json({ result: 1 });
    } else if (data.result === 2){
      res.json({ result: 2 });
    };
  });
});

// PAGE: Write
router.route('/freeboard/write')
.get(isLogged, (req, res, next) => {

  res.render('pages/board/write', {title: 'Free Board' })
})
.post(isLogged, (req, res, next) => {

  let usernum = req.session.user.usernum,
  username    = req.session.user.username,
  title       = req.body.title,
  contents    = req.body.contents;
  
  let writeConfig = {
    method: 'post',
    url: '/board/write',
    data: {
      usernum,
      username,
      title,
      contents
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

router.route('/freeboard/modify/:seq')
.get(isLogged, (req, res, next) => {
  //수정이 필요한 게시판 글 id, 이전 내용을 불러오기 위함
  let id = req.params.seq;
  let usernum = req.session.user.usernum; 
  let body = {};
  console.log(`modify: GET - No. ${id}`);

  let prevContentConfig = {
    url: '/board/modify',
    method: 'get',
    data: {
      id: +id,
      usernum
    }
  }
  AxiosWithDB(prevContentConfig, (response) => {
    let { data } = response;
    body.boardDetail = data;
    res.render('pages/board/modify', body);
  })
})
.post(isLogged, (req, res, next) => {

  let id   = req.params.seq,
  usernum  = req.session.user.usernum,
  username = req.session.user.username,
  title    = req.body.title,
  contents = req.body.contents;

  console.log(`modify: POST - No. ${id}`)
  
  let modifyConfig = {
    method: 'post',
    url: '/board/modify',
    data: {
      id: +id,
      usernum,
      username,
      title,
      contents
    }
  }
  AxiosWithDB(modifyConfig, (response) => {
    let { data } = response;
    if(data.result === 1 ){
      res.json({ result: 1 })
    } else {
      res.json({ result : 2 })
    }
  })
})

module.exports = router;
