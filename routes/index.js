var express = require('express');
var bodyParser = require('body-parser')
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/enter', function(req, res, next) {
  console.log(666, req.body)
  res.send(next);
});

module.exports = router;
