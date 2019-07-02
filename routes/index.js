const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  let username = "";
  let error_message = "";

  if(req.session.username !== undefined && req.session.username !== null && req.session.username !== "") username = req.session.username;

  if(req.session.error_msg !== undefined && req.session.error_msg !== null && req.session.error_msg !== "") {
    error_message = session.error_msg;
    console.log(session.error, session.error_msg);
    session.error = session.error_msg = "";
  }

  res.render('index', { title: 'Chattify', username: username, error: error_message });
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
