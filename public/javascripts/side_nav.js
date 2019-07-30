var socket = io();

function openNav() {
    $("#mySidenav").css('width', "250px");
}

$('#mySidenav').on("click", function(e) {
    e.stopPropagation();
})

$('body').on("click", function() {
    if($("#mySidenav").css('width') !== '0px') {
        $("#mySidenav").css('width', "0px");
    }
})

socket.on('user login', function(data) {
    $('#people_online_div').empty();
    let onlineUsers = data.users;

    onlineUsers.forEach(function(x) {
        $('#people_online_div').append('<div class="col-xs-12"><h5 class="white_color" href="#">'+x+'</h5></div>');
    })
});