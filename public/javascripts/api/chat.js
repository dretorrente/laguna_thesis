// var Socket = require('simple-websocket')
$(document).ready(function () {
    // var socket = io.connect();
    var ws = new WebSocket("wss://"+ window.location.host);
    ws.onopen = function(msg) {
        // Logic for opened connection
        console.log('Connection successfully opened');
    };
    var message = $('#inputMessage');


   // $('#form-message').on('submit',function(e){
   //     e.preventDefault();
   //     socket.emit('send message',message.val());
   //     message.val('');
   // });
   //
   // socket.on('new message',function(data){
   //    alert(data);
   // });



});