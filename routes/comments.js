var express = require('express');
var router = express.Router();

router.post('/write', function(req, res, next) {
  if(res.locals.loginid){ // 로그인 되어있을 경우


    











    res.redirect('back')
  } else { // 로그인이 안되어있을 경우
    res.redirect('/')
  }
});

module.exports = router;
