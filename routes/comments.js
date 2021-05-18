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

// 좋아요 처리 파트
router.post('/add_good', function(req, res, next) {
    if(res.locals.loginid){ // 로그인 되어있을 경우
        // up_down_check DB에 이미 좋아요/싫어요 한 기록이 있는지 체크
        MySqlHandler.DB.query(`SELECT * FROM \`up_down_check\` where (target = ${req.body.no} and user = '${res.locals.loginid}')`,
        (err, rows) => {
          // DB에 좋아요/싫어요 한 기록이 존재할 경우
          if(rows[0].value){
            console.log(rows.value)  
            res.redirect('back');
          } else { // DB에 좋아요/싫어요 한 기록이 없을 경우
            MySqlHandler.DB.query(`INSERT INTO \`up_down_check\` (user, value, target) VALUES ('${res.locals.loginid}', 1, '${req.body.no}');
            UPDATE \`comments\` SET good_num = good_num + 1 WHERE (no = ${req.body.no});`,
                (err, rows) => {
                    console.log('좋아요 되었습니다')
                    res.redirect('back');
                })
          }
        });
    } else { // 로그인이 안되어있을 경우
      res.redirect('/')
    }
  });

  // 싫어요 처리 파트
router.post('/add_good', function(req, res, next) {
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
