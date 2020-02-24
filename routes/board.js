const express = require('express');
const router = express.Router();
const {
  Axios,
  AxiosWithDB,
} = require('./common');
const { isLogged, wrap } = require('./middlewares');

router.get('/freeboard', (req, res, next)=>{
  req.session.prevUrl = req.originalUrl;
  res.render('pages/board/freeboard', {title: 'Free board' })
});

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
