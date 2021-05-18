var express = require('express');
var router = express.Router();

// Mysql DB와 관련된 부분 모듈화
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

// 암호화를 위한 모듈 및 암호화를 위한 값
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');

// jsonwebtoken 모듈
const jwt = require('jsonwebtoken');
const jwtconfig  = require('../config/jwt_secret.json');

/* GET users listing. */
router.post('/', function(req, res, next) {
  // 비밀번호는 암호화된 값을 사용
  crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.DB.query(`SELECT \`id\` FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`,
      (err, rows) => {
        if (rows[0] == null) {
          // 이 경우 아이디, 비밀번호가 잘못되었으므로 그냥 메인페이지로
          console.log('아이디 혹은 비밀번호가 잘못되었습니다');
          res.redirect('/')
        } else {
          // 아이디, 비밀번호가 일치하는 것이 존재할 경우 jwt를 발급
          var token = jwt.sign({id : rows[0].id}, `${jwtconfig.secret}`, {expiresIn: `${jwtconfig.expire}`});
          console.log('로그인 되었습니다.');
          // 토큰은 JWT라는 이름의 쿠키에 저장, 쿠키의 유효기간을 jwt의 유효기간과 같게 설정
          res.cookie("JWT", token, {
            maxAge: jwtconfig.expire,
            secure: true,
            HttpOnly: true
          });
          res.redirect('/')
        }
      });
    })
});

module.exports = router;
