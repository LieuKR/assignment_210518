var express = require('express');
var router = express.Router();

// Mysql DB와 관련된 부분 모듈화
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

// 댓글 작성하는 파트
router.post('/write', function(req, res, next) {
  if(res.locals.loginid){ // 로그인 되어있을 경우
    MySqlHandler.DB.query(`INSERT INTO \`comments\` (writer, contents, good_num, bad_num) VALUES ('${res.locals.loginid}', '${req.body.comment}', 0, 0)`,
      (err, rows) => {
        if(err) {throw err}
        res.redirect('back');
      });
  } else { // 로그인이 안되어있을 경우
    res.redirect('/')
  }
});

// 댓글 수정 파트
router.post('/update', function(req, res, next) {
    if(res.locals.loginid){ // 로그인 되어있을 경우
      MySqlHandler.DB.query(`UPDATE \`comments\` SET contents = '${req.body.comment}' WHERE (no = ${req.body.no} and writer = '${res.locals.loginid}')`,
        (err, rows) => {
          if(err) {throw err}
          res.redirect('back');
        });
    } else { // 로그인이 안되어있을 경우
      res.redirect('/')
    }
  });

  
// 댓글 삭제 파트
router.post('/delete', function(req, res, next) {
    if(res.locals.loginid){ // 로그인 되어있을 경우
      MySqlHandler.DB.query(`DELETE FROM \`comments\` WHERE (no = ${req.body.no} and writer = '${res.locals.loginid}')`,
        (err, rows) => {
          if(err) {throw err}
          res.redirect('back');
        });
    } else { // 로그인이 안되어있을 경우
      res.redirect('/')
    }
  });
  

module.exports = router;
