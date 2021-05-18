var express = require('express');
var router = express.Router();

const MySqlHandler = require('../serverside_functions/MySqlHandler.js');  

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.id)
  console.log(req.body.password)
  MySqlHandler.DB.query(`SELECT * FROM users`,
      (err, rows) => {
        console.log('test');
      });
  res.send('respond with a resource');
});

module.exports = router;
