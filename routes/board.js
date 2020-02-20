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

module.exports = router;
