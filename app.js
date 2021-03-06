const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');
const connection = require('./config/db');
const mongoose = require('mongoose');

const roomSchema = connection.roomSchema;

const room = mongoose.model('Room', roomSchema);

const indexRouter = require('./routes/index');
const chatRouter = require('./routes/chat');

const app = express();
const socket_io = require('socket.io');

const session = require('express-session');

const env_mode = process.env.NODE_ENV; // Check if app is in DEV mode or PRODUCTION mode

let session_key = process.env.session_key;
session_key = session_key.trim();

let app_session = app.use(session({
  secret: session_key,
  resave: false,
  rolling: true,
  saveUninitialized: true,
  cookie: {}
}))

// Set secure cookies if app is in PRODUCTION mode
if(env_mode === 'production') {
  app_session.cookie.secure = true;
  app_session.cookie.httpOnly = true;
}

// Socket.io
var io = socket_io();
app.io = io;

/* START -- Chat functionality */
var numUsers = 0;
var onlineUsers = [];

io.on( "connection", (socket) => {
  var addedUser = false;

  socket.on('add user', (username) => {
    if(onlineUsers.indexOf(username) === -1) {
      socket.username = username;
      onlineUsers.push(username);

      ++numUsers;
      addedUser = true;

      io.emit('user login', { current_username: username, users: onlineUsers });

      socket.broadcast.emit('user joined', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });

  socket.on('chat message', (data) => {
    room.findOneAndUpdate(
      { roomId: data.room_id }, 
      { 
        $push: { 
          messages: { username: data.username, message: data.message }
        } 
      },
      function (error, success) {
        if (error) {
          console.log(error);
        } else {
          io.emit('chat message', { username: data.username, message: data.message });
        }
      }
    );

  });

  socket.on('remove user', (data) => {
    let user_index = onlineUsers.indexOf(data);
    if (user_index > -1) {
      onlineUsers.splice(user_index, 1);
    }

    socket.disconnect();
    io.emit('user disconnected', { removed_username: data, users: onlineUsers });
  });
});

/* END -- Chat functionality */

app.use(helmet());
app.use(compression());

app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    styleSrc: ["'self'", 'stackpath.bootstrapcdn.com', 'use.fontawesome.com'],
    fontSrc: ["'self'", 'use.fontawesome.com'],
    scriptSrc: ["'self'", 'cdnjs.cloudflare.com', 'stackpath.bootstrapcdn.com']
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/chatroom', chatRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
