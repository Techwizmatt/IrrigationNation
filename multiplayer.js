var socket = io('http://24.251.100.87:234');

var id = 0;
var started = false;
var currentFrame = 0;
var currentOptions = {};

socket.on('connect', function(connection){
    console.log('Connected to IO server.');
    // socket.emit('echo', {started:started, currentFrame: currentFrame, currentOptions: currentOptions});

});

socket.on('update', function(data){
   console.log(data);
});

socket.on('register', function(data){
    id = data['id'];
    console.log('My game id is ' + id);
});


socket.on('message', function (data) {
    console.log('MESSAGE' + data.toString());
    debugger;
    if (data.id == id) {
        //Pertains to this instance
        console.log('The response pertains to me');
    }
})
socket.on('disconnect', function(){
    console.log('DISCONNECTED FROM SERVER, IS THAT RIGHT?');
});
