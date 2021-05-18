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

module.exports = router;
