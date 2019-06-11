const express = require('express');
const router = express.Router();

/* Start the chat app */
router.post('/', function(req, res, next) {
  let username = req.body.username_hidden;
  if(username === '') username = 'Guest';

  res.render('chat_app', { title: 'Chattify room', user: username });
});

module.exports = router;
