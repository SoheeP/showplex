const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
} = require('./common');
const { wrap } = require('./middlewares');

router.get('/freeboard', (req, res, next)=>{
  res.render('pages/board/freeboard', {title: 'Free board'})
});

router.get('/freeboard/write', (req, res, next) => {
  res.render('pages/board/write', {title: 'Free Board'})
})
.post((req, res, next) => {

  let text = req.body.text,
  contents = req.body.contents;
  
  let writeConfig = {
    method: 'post',
    url: '/board/write',
    data: {
      text: text,
      contents: contents
    }
  }
  AxiosWithDB(writeConfig, (response) => {
    
  })
})

module.exports = router;
