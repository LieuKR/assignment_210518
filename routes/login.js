var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
  console.log(req.body.id)
  console.log(req.body.password)
  res.send('respond with a resource');
});

module.exports = router;
