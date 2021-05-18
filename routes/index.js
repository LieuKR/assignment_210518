var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(res.locals.loginid){
    res.redirect('/comments')
  } else {
    res.render('index', { title: '메인' });
  }
});

router.get('/comments', function(req, res, next) {
  if(res.locals.loginid){
    res.render('comments', { title: '댓글' });
  } else {
    res.redirect('/')
  }
});

module.exports = router;
