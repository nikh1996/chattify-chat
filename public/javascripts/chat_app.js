$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    let room_id = $('#hidden_room_id').val();

    var socket = io();

    socket.emit('add user', $('#hidden_user').val());

    $('#send_msg').on("click", function(e){
      if($('#chat_message').val() != '') {
        let username = $('#hidden_user').val();
        let message = $('#chat_message').val();

        socket.emit('chat message', { room_id: room_id, username: username, message: message });
        $('#chat_message').val('');
      } else { // Focus input field if empty message is sent
        $('#chat_message').focus(); 
      }
    });

    socket.on('chat message', function(data){
      message(data.username, data.message, 'Yes');
    });

    socket.on('user login', function(data) {
      let current_user = $('#hidden_user').val();
      let username = data.current_username;

      let people_online = data.users;
      let people_online_count = (people_online.length - 1);
      let people_online_template = "";
      let people_online_template_message = "";

      if(current_user === username) {
        username = 'You have';

        if(people_online_count === 0) people_online_template_message = "There is no one online right now...";
        else people_online_template_message = "There are "+people_online_count+" people online right now!";

      } else {
        username = username+' has';
      }

      let theme_message = "new_user_prompt_dark";
      if($('body').hasClass('light-theme')) theme_message = "new_user_prompt";

      let template = '<div class="row text-center"><div class="col-sm-4"></div><div class="col-sm-4 '+theme_message+' user_prompt">'+username+' joined the chat!</div><div class="col-sm-4"></div></div>&nbsp;';
      $('#message_area').append(template);

      if(people_online_template_message !== "" && people_online_template_message !== undefined && people_online_template_message !== null) {
        people_online_template = '<div class="row text-center"><div class="col-sm-4"></div><div class="col-sm-4 '+theme_message+' user_prompt">'+people_online_template_message+'</div><div class="col-sm-4"></div></div>&nbsp;';
        $('#message_area').append(people_online_template);
      }

      get_chat_messages(room_id);
    });

    socket.on('user joined', function(data) {
      console.log(data);
    });

    socket.on('user disconnected', function(data) {
      console.log(data);
    });

    // Disconnect socket for the user when logout
    $('#logout-yes').on("click", function() {
      let current_user = $('#hidden_user').val();
      socket.emit('remove user', current_user);
    })

    let input = document.getElementById("chat_message");

    input.addEventListener("keyup", function(event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        document.getElementById("send_msg").click();
      }
    });
});

$('#people_online_nav_button').on('click', function() {
  openNav();
});

$('#dark_light').on('click', function() {
  toggle_theme();
});

// Toggle between light/dark theme
function toggle_theme(mode) {
  $('[data-toggle="tooltip"]').tooltip('hide');

  if($('body').hasClass('light-theme') || mode === 'dark') { // Dark mode
    $('body').addClass('dark-theme').removeClass('light-theme');
    $('#dark_light').addClass('btn-warning').removeClass('btn-dark').attr('data-original-title','Switch to light theme!').tooltip('show');
    $('#dark_light_icon').addClass('fa-sun').removeClass('fa-moon');
    $('#message_area').addClass('chat-area-dark').removeClass('chat-area-light');
    $('#chat_message').addClass('chat-text-dark');

    // The group room name color change
    $('#room_name').addClass('room_name_dark').removeClass('room_name');

    // The user prompt color change
    $('.user_prompt').addClass('new_user_prompt_dark').removeClass('new_user_prompt');

    // The user messages color change
    $('.currentuser_message').addClass('chat-currentuser-dark').removeClass('chat-currentuser-light');
    $('.otheruser_message').addClass('chat-otheruser-dark').removeClass('chat-otheruser-light');

    // Logout modal color change
    $('#logout_theme_change').addClass('logout-dark-theme').removeClass('logout-light-theme');
  } else {  // Light mode
    $('body').removeClass('dark-theme').addClass('light-theme');
    $('#dark_light').removeClass('btn-warning').addClass('btn-dark').attr('data-original-title','Switch to dark theme!').tooltip('show');
    $('#dark_light_icon').removeClass('fa-sun').addClass('fa-moon');
    $('#message_area').removeClass('chat-area-dark').addClass('chat-area-light');
    $('#chat_message').removeClass('chat-text-dark');

    // The group room name color change
    $('#room_name').addClass('room_name').removeClass('room_name_dark');

    // The user prompt color change
    $('.user_prompt').addClass('new_user_prompt').removeClass('new_user_prompt_dark');

    // The user messages color change
    $('.currentuser_message').addClass('chat-currentuser-light').removeClass('chat-currentuser-dark');
    $('.otheruser_message').addClass('chat-otheruser-light').removeClass('chat-otheruser-dark');

    // Logout modal color change
    $('#logout_theme_change').addClass('logout-light-theme').removeClass('logout-dark-theme');
  }
}

// Get the chat messages of a room
function get_chat_messages(room_id) {
  $.ajax({
    type: "POST",
    dataType: "json",
    url: "/chatroom/chat_messages",
    data: {
      room_id: room_id
    },
    success: function(result) {
      let messages = result;
      for(let count = 0; count < messages.length; count ++) {
        // Pass the username and message values to the message function
        message(messages[count].username, messages[count].message, 'No');
      }
    }, 
    error: function(error) {
      console.log(error);
    }
  });
}

// Get messages and append them to the message area
function message(username_val, message_val, notification) {
  let current_user = $('#hidden_user').val();
  let username = username_val;
  let message = message_val;
  let chat_position = "chat-otheruser";

  // Check if the current user has messaged and if yes, changed to 'You' label
  if(current_user === username) {
    chat_position = "chat-currentuser";
    username = "You";
  }

  // Setting dark mode as default before checking user's current theme
  let theme_message_currentuser = "chat-currentuser-dark";
  let theme_message_otheruser = "chat-otheruser-dark";

  // Check if the user has light theme mode set
  if($('body').hasClass('light-theme')) {
    theme_message_currentuser = "chat-currentuser-light";
    theme_message_otheruser = "chat-otheruser-light";
  }

  // Show current user's message in right
  let template = '<div class="row"><div class="col-sm-5"></div><div class="col-sm-7"><div class="card currentuser_message '+theme_message_currentuser+' mb-3"><div class="card-body"><h5 class="card-title">'+username+'</h5><p class="card-text">'+message+'</p></div></div></div></div>';

  // Show other user's message in left
  if(chat_position !== 'chat-currentuser') {
    template = '<div class="row"><div class="col-sm-7"><div class="card otheruser_message '+theme_message_otheruser+' mb-3"><div class="card-body"><h5 class="card-title">'+username+'</h5><p class="card-text">'+message+'</p></div></div></div><div class="col-sm-5"></div></div>';
  }

  // Show message notification
  if(username !== 'You' && notification !== 'No') {
    if(Push.Permission.has() === true) {
      Push.create(username, {
        body: message,
        onClick: function () {
            window.focus();
            this.close();
        }
      });
    } else {
      Push.Permission.request().then(function(onGranted) {
        console.log(onGranted);
      })
      .catch(function(onDenied) {
        console.log(onDenied);
      });
    }
  }
  
  $('#message_area').append(template);
}