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
  req.session.prevUrl = req.originalUrl;
  req.session.readSeq = req.params.seq;
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
    body.title = response.data.title
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

router.route('/freeboard/detail/modify')
.get((req, res, next) => {
  //수정이 필요한 게시판 글 id, 이전 내용을 불러오기 위함
  let id = req.session.readSeq;
  let usernum = req.session.user.usernum; 

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
    console.log(data);
  })
  res.render('pages/board/modify');
})
.post((req, res, next) => {
  let id = req.session.readSeq;
  let usernum = req.session.user.usernum;

  let modifyConfig = {
    url:'/board/modify',
    method: 'post',
    data: {
      id: +id,
      usernum
    }
  }
  AxiosWithDB(modifyConfig, (response) => {
    let { data } = response;
    console.log(data);
  })
})

module.exports = router;
