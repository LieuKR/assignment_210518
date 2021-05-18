var express = require('express');
var router = express.Router();

// Mysql DB와 관련된 부분 모듈화
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

/* GET home page. */
router.get('/', function(req, res, next) {
  if(res.locals.loginid){
    res.redirect('/comments')
  } else {
    res.render('index', {title: '메인' });
  }
});

router.get('/comments', function(req, res, next) {
  if(res.locals.loginid){
    MySqlHandler.DB.query(`SELECT * FROM \`comments\` ORDER BY \`no\` ASC`,
      (err, rows) => {
        res.render('comments', {title: '댓글', comments : rows});
      });
  } else {
    res.redirect('/')
  }
});

module.exports = router;
