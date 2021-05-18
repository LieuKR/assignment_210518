var express = require('express');
var router = express.Router();

// Mysql DB와 관련된 부분 모듈화
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

// 암호화를 위한 모듈 및 암호화를 위한 값
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');

// jsonwebtoken 모듈
const jwt = require('jsonwebtoken')
const jwtconfig  = require('../config/jwt_secret.json');

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.id)
  console.log(req.body.password)

  crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.DB.query(`SELECT * FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`,
      (err, rows) => {
        if (rows[0] == null) {
          // 이 경우 아이디, 비밀번호가 잘못되었으므로 그냥 메인화면으로 보냄
          console.log('아이디 혹은 비밀번호가 잘못되었습니다');
        } else {
          // 이 경우 jwt를 발급
          var token = jwt.sign({test : 'test1', testtest : 'testets'}, `${jwtconfig.secret}`);
          console.log(token)
          console.log('로그인 되었습니다. jst를 검증합니다.');
          var decoded_data = jwt.verify(token, `${jwtconfig.secret}`);
          console.log(decoded_data)
        }
      });
    })

  res.send('respond with a resource');
});

module.exports = router;
