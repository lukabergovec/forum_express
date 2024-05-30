var express = require('express');
var router = express.Router();

var questionsController = require('../controllers/questionsController.js');


/* GET home page. */
router.get('/', questionsController.list);

router.get('/login', function(req, res, next) {
  res.render('users/login');
});

router.get('/register', function(req, res, next) {
  res.render('users/register');
});

router.get('/addQuestion', function(req, res, next) {
  if(req.session.userId){
    res.render('questions/add', {uid: req.session.userId });
  }else{
    res.redirect('/');
  }
});


module.exports = router;
