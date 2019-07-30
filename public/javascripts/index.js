$(function () {
  let input = document.getElementById("chat_name");

  if(input !== null && input !== undefined) {
    input.addEventListener("keyup", function (event) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Number 13 is the "Enter" key on the keyboard
      if (event.keyCode === 13) {
        // Trigger the button element with a click
        check_user();
      }
    });
  }
});

$('#login_button').on("click", function() {
  login_user();
});

$('#register_button').on("click", function() {
  register_user();
});

$('#register_button_href').on("click", function() {
  $('#register_div').fadeIn();
  $('#login_div').css('display', 'none');
});

$('#login_button_href').on("click", function() {
  $('#register_div').css('display', 'none');
  $('#login_div').fadeIn();
});

$('#create_room_button_main_div, #create_room_button_join_div').on("click", function() {
  room_div_options('create_room');
});

$('#join_room_button_main_div, #join_room_button_create_div').on("click", function() {
  room_div_options('join_room');
});

function login_user() {
  let login_username = $('#login_username').val();
  let login_password = $('#login_password').val();
  $('#username_hidden_create, #username_hidden_join').val(login_username);

  if (login_username === '' || login_password === '') {
    $('#login_username').addClass('error-input');
    $('#login_password').addClass('error-input');
  } else {
    $('#login_session_form').submit();
  }
}

function register_user() {
  let display_name = $('#register_displayname').val();
  let register_username = $('#register_username').val();
  let register_password = $('#register_password').val();
  $('#username_hidden_create, #username_hidden_join').val(register_username);

  if (display_name === '' || register_username === '' || register_password === '') {
    $('#register_displayname').addClass('error-input');
    $('#register_username').addClass('error-input');
    $('#register_password').addClass('error-input');
  } else {
    $('#register_session_form').submit();
  }
}

function room_div_options(type) {
  if (type === 'create_room') {
    $('#create_room_buttons, #join_room_div').addClass('dispnone');
    $('#create_room_div').removeClass('dispnone');
  }
  if (type === 'join_room') {
    $('#create_room_div, #create_room_buttons').addClass('dispnone');
    $('#join_room_div').removeClass('dispnone');
  }
  if (type === 'room_button') {
    $('#create_room_div, #join_room_div').addClass('dispnone');
    $('#create_room_buttons').removeClass('dispnone');
  }
}