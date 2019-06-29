const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const session = require('express-session');
const mongoose = require('mongoose');
const connection = require('../config/db');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomId: String,
  roomName: String,
  usersJoined: Array,
  allowedUsers: Array,
  createdDate: { type: Date, default: Date.now }
});

const room = mongoose.model('Room', roomSchema);

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
  let current_user = req.session.username;

  let type = req.params.type;

  if(type === 'create') {
    let room_name = req.body.create_room_name;
    let room_id = uuidv4();

    let create_room = new room({ 
      roomId: room_id,
      roomName: room_name,
      usersJoined: current_user
    });

    create_room.save(function (err, result) {
      if (err) {
        res.redirect('/');
      }
    });
  
    res.redirect('/chatroom/room/'+room_id);
  } else if(type === 'join') {
    let room_id = req.body.join_room_id;

    room.findOne({ roomId: room_id }, function(err, result) {
      if(err || result === null) {
        res.redirect('/');
      } else {
        let allowedUsers = result.allowedUsers;
        let usersJoined = result.usersJoined;
        console.log(current_user, allowedUsers, allowedUsers.length, usersJoined, usersJoined.indexOf(current_user));
        if(allowedUsers.length > 0) {
          if(allowedUsers.indexOf(current_user) === -1) {
            res.redirect('/');
            return;
          }
        }

        if(usersJoined.indexOf(current_user) === -1) {
          room.findOneAndUpdate(
          { roomId: room_id }, 
          { 
            $push: { 
              usersJoined: current_user
            } 
          },
          function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log(success);
            }
          })
        }

        res.redirect('/chatroom/room/'+room_id);
      }
    });
  } else {
    res.redirect('/');
  }
});

// Redirect to either Global room or user inputted room based on UUID
router.get('/room/:room_id', function(req, res, next) {
  let room_id = req.params.room_id;
  let username = req.session.username;
  let room_name = "Global chat";

  if(username === undefined || username === '') {
    res.redirect('/');
  } else {
    room.findOne({ roomId: room_id }, function(err, result) {
      if(err) {
        res.redirect('/');
      } else {
        if(result) {
          if(result.roomName !== undefined && result.roomName !== null && result.roomName !== '') {
            room_name = result.roomName;
          }
        }
        res.render('chat_app', { title: 'Chattify room', user: username, room_name: room_name });
      }
    });  
  }
});

module.exports = router;