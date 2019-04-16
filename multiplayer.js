var socket = io('http://localhost:234');

var id = 0;
var started = false;
var currentFrame = 0;
var currentOptions = {};

socket.on('connect', function(data){
    console.log('Connected.');

    socket.emit('echo', {started:started, currentFrame: currentFrame, currentOptions: currentOptions});
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

