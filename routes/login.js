var express = require('express');
var router = express.Router();

// Mysql DB와 관련된 부분 모듈화
const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

// 암호화를 위한 모듈 및 암호화를 위한 값
const crypto = require('crypto');
const cryptoconfig  = require('../config/pwcryptset.json');

// jsonwebtoken 모듈
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.id)
  console.log(req.body.password)

  crypto.pbkdf2(req.body.password, cryptoconfig.salt, cryptoconfig.runnum, cryptoconfig.byte, 
    cryptoconfig.method, (err, derivedKey) => {
      MySqlHandler.DB.query(`SELECT * FROM users WHERE id='${req.body.id}' and password='${derivedKey.toString('hex')}'`,
      (err, rows) => {
        if (rows[0] == null) {
          console.log('아이디 혹은 비밀번호가 잘못되었습니다');
        } else {
          console.log('로그인 되었습니다');
        }
      });
    })

  res.send('respond with a resource');
});

module.exports = router;
