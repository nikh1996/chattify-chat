const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userId: String,
  displayName: String,
  userName: String,
  password: String,
  createdDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  friendsList: Array,
  blockedList: Array
});

const user = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  let session = req.session;
  let username = "";
  let displayname = "";
  let error_message = "";

  if(req.session.username !== undefined && req.session.username !== null && req.session.username !== "") {
    username = req.session.username;
    displayname = req.session.displayname;
  }

  if(req.session.error_msg !== undefined && req.session.error_msg !== null && req.session.error_msg !== "") {
    error_message = session.error_msg;
    session.error = session.error_msg = "";
  }

  res.render('index', { title: 'Chattify', username: username, displayname: displayname, error: error_message });
});

router.post('/:type', function(req, res, next) {
  let session = req.session;
  let post_type = req.params.type;

  if(post_type === 'login' || post_type === 'register') {
    let user_id = uuidv4();

    /* START -- Login process */
    if(post_type === 'login') {
      let login_username = req.body.login_username;
      let login_password = req.body.login_password;

      user.findOne({ userName: login_username }, function(err, result) {
        if(err) {
          session.error = err.message;
          session.error_msg = "There seems to be an issue... Please try again later";
          res.redirect('/');
          return;
        } else {
          if(result) {
            bcrypt.compare(login_password, result.password, function(err, check_password) {
              if(check_password === true) {
                session.userid = result.userId;
                session.displayname = result.displayName;
                session.username = result.userName;

                res.redirect('/');
                return;
              } else {
                session.error = "Password does not match";
                session.error_msg = "The username/password combination does not exist! Try again!";

                res.redirect('/');
                return;
              }
            });
          } else {
            session.error = "No user found";
            session.error_msg = "The username/password combination does not exist! Try again!";

            res.redirect('/');
            return;
          }
        }
      });
    }
    /* END -- Login process */

    /* START -- Register process */
    if(post_type === 'register') {
      let register_displayname = req.body.register_displayname;
      let register_username = req.body.register_username;
      let register_password = req.body.register_password;

      user.findOne({ userName: register_username }, function(err, result) {
        if(result) {
          session.error = "This user already exists";
          session.error_msg = "This username already exists! Please try a new one!";

          res.redirect('/');
          return;
        } else {
          bcrypt.genSalt(10, function(err, salt) {
            if (err) {
              session.error = err.message;
              session.error_msg = "There seems to be an issue while creating the user. Please try again later!";
    
              res.redirect('/');
              return;
            }
    
            bcrypt.hash(register_password, salt, function(err, hash) {
              if (err) {
                session.error = err.message;
                session.error_msg = "There seems to be an issue while creating the user. Please try again later!";
    
                res.redirect('/');
                return;
              } else {
                let create_user = new user({ 
                  userId: user_id,
                  displayName: register_displayname,
                  userName: register_username,
                  password: hash
                });
          
                create_user.save(function (err, result) {
                  if (err) {
                    session.error = err.message;
                    session.error_msg = "There seems to be an issue while creating the user. Please try again later!";
    
                    res.redirect('/');
                    return;
                  } else {
                    res.redirect('/');
                    return;
                  }
                });
              }
            });
          });
        }
      });
    }
    /* END -- Register process */
  } else {
    res.redirect('/');
  }
});

router.get('/logout', function(req, res, next) {
  req.session.destroy();
  
  res.redirect('/');
});

module.exports = router;
