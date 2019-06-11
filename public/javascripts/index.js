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
      $('#exampleModalCenter').modal('show');
      $('#modal-header').addClass('stranger-dark').removeClass('btn-primary');
      $('#exampleModalCenterTitle').html('<i class="fas fa-user-secret"></i>&nbsp;&nbsp;Wanna be a stranger?');
      $('#modal_body_msg').html('You have not entered your name... Do you want to continue as a Guest or do you want to enter your name?');
      $('#continue_button').html('Continue as Guest');
      $('#back_button').html('Back to the naming board!');
    }
    else {
      $('#exampleModalCenter').modal('show');
      $('#modal-header').removeClass('stranger-dark').addClass('btn-primary');
      $('#exampleModalCenterTitle').html('<i class="far fa-user"></i>&nbsp;&nbsp;Ready to chat?');
      $('#modal_body_msg').html('The name you entered is <b>'+username+'</b>! Do you confirm this as your username for the session?');
      $('#continue_button').html('Continue as '+username);
      $('#back_button').html('Back to the naming board!');
    }
  }