$(function () {
    let input = document.getElementById("chat_name");

    input.addEventListener("keyup", function(event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        check_user();
      }
    });
  });

  function check_user() {
    let username = $('#chat_name').val();
    $('#username_hidden').val(username);

    if(username == '') {
      $('#chat_name').addClass('error-input');
    } else {
      $('#chat_name').removeClass('error-input');
      $('#username_div').css('display','none');
      $('#room_div').fadeIn();
      $('#user_greeting').text('Hey '+username+'!');
    }
  }

  function create_room() {
    let username = $('#chat_name').val();
    $('#username_hidden').val(username);

    if(username == '') {
      $('#chat_name').addClass('error-input');
    } else {
      $('#chat_name').removeClass('error-input');
      $('#username_div').css('display','none');
      $('#room_div').fadeIn();
      $('#user_greeting').text('Hey '+username+'!');
    }
  }

  function room_div_options(type) {
    if(type === 'create_room') {
      $('#create_room_buttons, #join_room_div').css('display','none');
      $('#create_room_div').fadeIn();
    }
    if(type === 'join_room') {
      $('#create_room_div, #create_room_buttons').css('display','none');
      $('#join_room_div').fadeIn();
    }
    if(type === 'room_button') {
      $('#create_room_div, #join_room_div').css('display','none');
      $('#create_room_buttons').fadeIn();
    }
  }