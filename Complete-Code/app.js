

// STEP 8

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.send('<h1>Hello world</h1>');
});

io.on('connection', function(socket){

    socket.on('room', function(chatRoom){
        socket.chatRoom = chatRoom;
        socket.join(socket.chatRoom);
        console.log('a user connected to chat room: ' + chatRoom);
    });

    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('chat message', function(userName, msg){
        io.in(socket.chatRoom).emit('chat message', userName, msg);
    });


    // server side event for typing and typing end
    socket.on('typing', function(userName){
        console.log(userName + ' is typing');
        socket.to(socket.chatRoom).broadcast.emit('typing', userName);
    });

    socket.on('typing end', function(){
        console.log('not typing');
        socket.to(socket.chatRoom).broadcast.emit('typing end');
    });


});

http.listen(3000, function(){
    console.log('listening on *:3000');
});
