$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    var socket = io();

    socket.emit('add user', $('#hidden_user').val());

    $('#send_msg').on("click", function(e){
      if($('#chat_message').val() != '') {
        socket.emit('chat message', $('#chat_message').val());
        $('#chat_message').val('');
      } else { // Focus input field if empty message is sent
        $('#chat_message').focus(); 
      }
    });

    socket.on('chat message', function(data){
      let current_user = $('#hidden_user').val();
      let username = data.username;
      let chat_position = "chat-otheruser";

      if(current_user === data.username) {
        chat_position = "chat-currentuser";
        username = "You";
      }

      let theme_message_currentuser = "chat-currentuser-dark";
      let theme_message_otheruser = "chat-otheruser-dark";

      if($('body').hasClass('light-theme')) {
        theme_message_currentuser = "chat-currentuser-light";
        theme_message_otheruser = "chat-otheruser-light";
      }

      let template = '<div class="row"><div class="col-sm-5"></div><div class="col-sm-7"><div class="card currentuser_message '+theme_message_currentuser+' mb-3" style="min-width: 50rem; max-width: 80rem;"><div class="card-body" style="padding: 0.8rem;"><h5 class="card-title">'+username+'</h5><p class="card-text">'+data.message+'</p></div></div></div></div>';

      if(chat_position !== 'chat-currentuser') {
        template = '<div class="row"><div class="col-sm-7"><div class="card otheruser_message '+theme_message_otheruser+' mb-3" style="min-width: 50rem; max-width: 80rem;"><div class="card-body" style="padding: 0.8rem;"><h5 class="card-title">'+username+'</h5><p class="card-text">'+data.message+'</p></div></div></div><div class="col-sm-5"></div></div>';
      }
      
      $('#message_area').append(template);
    });

    socket.on('user login', function(data) {
      let current_user = $('#hidden_user').val();
      let username = data.current_username+' has';

      if(current_user === data.current_username) username = 'You have';

      let theme_message = "new_user_prompt_dark";
      if($('body').hasClass('light-theme')) theme_message = "new_user_prompt";

      let template = '<div class="row text-center"><div class="col-sm-4"></div><div class="col-sm-4 '+theme_message+' user_prompt">'+username+' joined the chat!</div><div class="col-sm-4"></div></div>&nbsp;';
      $('#message_area').append(template);
    });

    socket.on('user joined', function(data) {
      console.log(data);
    });

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

  function toggle_theme(mode) {
    $('[data-toggle="tooltip"]').tooltip('hide');

    if($('body').hasClass('light-theme') || mode === 'dark') { // Dark mode
      $('body').addClass('dark-theme').removeClass('light-theme');
      $('#dark_light').addClass('btn-warning').removeClass('btn-dark').attr('data-original-title','Switch to light theme!').tooltip('show');
      $('#dark_light_icon').addClass('fa-sun').removeClass('fa-moon');
      $('#message_area').addClass('chat-area-dark').removeClass('chat-area-light');
      $('#chat_message').addClass('chat-text-dark');

      // The user prompt color change
      $('.user_prompt').addClass('new_user_prompt_dark').removeClass('new_user_prompt');

      // The user messages color change
      $('.currentuser_message').addClass('chat-currentuser-dark').removeClass('chat-currentuser-light');
      $('.otheruser_message').addClass('chat-otheruser-dark').removeClass('chat-otheruser-light');
    } else {  // Light mode
      $('body').removeClass('dark-theme').addClass('light-theme');
      $('#dark_light').removeClass('btn-warning').addClass('btn-dark').attr('data-original-title','Switch to dark theme!').tooltip('show');
      $('#dark_light_icon').removeClass('fa-sun').addClass('fa-moon');
      $('#message_area').removeClass('chat-area-dark').addClass('chat-area-light');
      $('#chat_message').removeClass('chat-text-dark');

      // The user prompt color change
      $('.user_prompt').addClass('new_user_prompt').removeClass('new_user_prompt_dark');

      // The user messages color change
      $('.currentuser_message').addClass('chat-currentuser-light').removeClass('chat-currentuser-dark');
      $('.otheruser_message').addClass('chat-otheruser-light').removeClass('chat-otheruser-dark');
    }
  }