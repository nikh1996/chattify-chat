const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let username = "";
  if(req.session.username !== undefined && req.session.username !== null && req.session.username !== "") username = req.session.username;

  res.render('index', { title: 'Chattify', username: username });
});

router.post('/', function(req, res, next) {
  let session = req.session;
  session.username = req.body.chat_name;

  res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  
  res.redirect('/');
});

module.exports = router;
