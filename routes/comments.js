var express = require('express');
var router = express.Router();

router.get('/23465comments', function(req, res, next) {
  if(res.locals.loginid){
    res.render('comments', { title: '댓글' });
  } else {
    res.redirect('/')
  }
});

module.exports = router;
