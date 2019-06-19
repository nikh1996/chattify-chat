const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');

router.post('/', function(req, res, next) {
  let username = req.body.username_hidden;
  if(username === '') username = 'Guest';

  res.render('chat_app', { title: 'Chattify room', user: username });
});

/* Redirect to global chat if empty parameter */
router.get('/room', function(req, res, next) {
  res.redirect('/chatroom/room/Global');
});

// Redirect to either Global room or user inputted room based on UUID
router.get('/room/:room_id', function(req, res, next) {
  let username = req.body.username_hidden;
  if(username === '') username = 'Guest';

  res.render('chat_app', { title: 'Chattify room', user: username });
});

router.post('/room/create_room', function(req, res, next) {
  let username = req.body.username_hidden;
  if(username === '') username = 'Guest';

  let room_name = req.body.room_name;
  let room_id = uuidv4();

  res.render('chat_app', { title: 'Chattify room', user: username });
});

module.exports = router;