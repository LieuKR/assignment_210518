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
            if(rows[0] == undefined) { // DB에 좋아요/싫어요 한 기록이 없을 경우 => 좋아요 추가
                MySqlHandler.DB.query(`INSERT INTO \`up_down_check\` (user, value, target) VALUES ('${res.locals.loginid}', 1, '${req.body.no}');
                UPDATE \`comments\` SET good_num = good_num + 1 WHERE (no = ${req.body.no});`,
                    (err, rows) => {
                        if(err) throw(err);
                        console.log('좋아요 되었습니다.')
                        res.redirect('back');
                    })
            } else if(rows[0].value == 1){ // DB에 좋아요 했던 기록이 존재할 경우 => 좋아요 취소
                MySqlHandler.DB.query(`DELETE FROM \`up_down_check\` WHERE (target = ${req.body.no} and user = '${res.locals.loginid}');
                UPDATE \`comments\` SET good_num = good_num - 1 WHERE (no = ${req.body.no});`,
                    (err, rows1) => {
                        if(err) throw(err);
                        console.log('좋아요가 취소되었습니다.')
                        res.redirect('back');
                    })
            } else if(rows[0].value == 2){ // DB에 싫어요 했던 기록이 존재할 경우 => 싫어요 취소 & 좋아요 추가
                MySqlHandler.DB.query(`UPDATE \`up_down_check\` SET value = 1 WHERE (target = ${req.body.no} and user = '${res.locals.loginid}');
                UPDATE \`comments\` SET bad_num = bad_num - 1, good_num = good_num + 1 WHERE (no = ${req.body.no});`,
                    (err, rows1) => {
                        if(err) throw(err);
                        console.log('싫어요가 취소되고, 좋아요 되었습니다.')
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
