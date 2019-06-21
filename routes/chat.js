const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const session = require('express-session');

/* Redirect to global chat if empty parameter */
router.get('/', function(req, res, next) {
  res.redirect('/chatroom/room/Global');
});

/* Redirect to global chat if empty parameter */
router.get('/room', function(req, res, next) {
  res.redirect('/chatroom/room/Global');
});

// Create or join a room based on the paramaters
router.post('/create_join_room/:type', function(req, res, next) {
  let type = req.params.type;
  console.log(req.session, type);

  if(type === 'create') {
    let username = req.body.username;
    let room_name = req.body.create_room_name;
    let room_id = uuidv4();

    console.log(req.body);
  
    res.redirect('/chatroom/room/'+room_id);
  } else if(type === 'join') {
    let username = req.body.username;
    let room_id = req.body.join_room_id;

    res.redirect('/chatroom/room/'+room_id);
  } else {
    res.redirect('/');
  }
});

// Redirect to either Global room or user inputted room based on UUID
router.get('/room/:room_id', function(req, res, next) {
  let room_id = req.params.room_id;

  if(room_id === '') room_id = "Global";

  res.render('chat_app', { title: 'Chattify room', user: username });
});

module.exports = router;