$(document).ready(function () {
    var room = shortUrl();
    var username = $(".hiddenAuthName").val();
    var socket = io.connect();
    socket.emit('new user', username);
    socket.on('usernames', function (res) {
        if(res.indexOf(username) > -1){
            res.splice(res.indexOf(username),1);
        }
        if(res.length > 0){
            var users = JSON.stringify(res);
            $.ajax({
                type: "POST",
                url: "/dashboard/getusers",
                data: {users: users},
                dataType: 'json'
            }).done(function (data) {
                var html ="";
                var users = data.users;
                for(var i=0; i<users.length; i++){
                    html += '<div class="chat-message clearfix">' +
                        '<img src="/images/' + users[i].upload + '" alt="" width="32" height="32"/>' +
                        '<div class="chat-message-content clearfix">' +
                        '<h4>' + users[i].username + '</h4>' +
                        '<a class="videoCall" data-room="'+room+'" target="_blank">' +
                        '<i aria-hidden="true" class="fa fa-video-camera"></i>' +
                        '</a>' +
                        '<a class="chat_time" href="javascript:;">' +
                        '<i aria-hidden="true" class="fa fa-weixin"></i>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<hr/>';
                }
                $('.chat-history').html(html);
            });
        } else{
            $('.chat-history').html('');
        }
    });
    $("#live-chat header.clearfix").click(function () {
        $(this).parent().find('.chat').slideToggle("slow");
    });
    //for video socket
    $(document).on("click", ".videoCall", function (event) {
        var roomUrl = $(this).attr('data-room');
        var usercall = $(this).parent().find('h4').text();
        socket.emit('send video',{username:usercall,roomUrl:roomUrl}, function(data){
            window.location.href = 'https://' + window.location.host + '/' + roomUrl;
        });
    });

    socket.on('video-call', function (data) {
        if (confirm(data.nick+" wants to video call with you!")) {
            window.location.href = 'https://' + window.location.host + '/' + data.room;
        } else {
            alert('Why did you press cancel? You should have confirmed');
        }
    });
    //for chat socket
    $(document).on("click", ".chat_time", function (event) {
        var receiver = $(this).parent().find('h4').text();
        $.ajax({
            type: "POST",
            url: "/dashboard/createThread",
            data: {receiver: receiver},
            dataType: 'json'
        }).done(function (data) {
            if (data.success) {
                window.location.href = 'https://' + window.location.host + '/chatroom/' + data.id + '/' + receiver;
            } else {
                window.location.href = 'https://' + window.location.host + '/chatroom/' + data.id + '/' + receiver;
            }
        });
    });


    function shortUrl() {
        return ("000000" + (Math.random() * Math.pow(36, 6) << 0).toString(36)).slice(-6)
    }

});