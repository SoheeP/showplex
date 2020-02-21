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
  
})

module.exports = router;
