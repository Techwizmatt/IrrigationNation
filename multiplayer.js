var socket = io('http://24.251.100.87:234');

var id = 0;
var started = false;
var currentFrame = 0;
var currentOptions = {};

socket.on('connect', function(){
    debuggerLog('Connected to Multiplayer IO server.');
    $('#multiplayer').fadeIn("fast");
});

socket.on('update', function(data){
    // updates from server (Player count, etc...)
    debuggerLog("Player count:" + data['count']);
});

socket.on('option', function(data){
    // Majority vote from players, received from server
    debuggerLog(data);

    var largest = _.max(Object.keys(data), function (o) {
        return data[o];
    });

    if (!isNaN(largest)) {
        largest = "A";
    }

    debuggerLog('Set value: ' + largest);

    $('#winningOption').html(largest);
    $('#winningOption').fadeIn("slow", function(){
        setTimeout(function(){
            simulateKeyPress(largest);
            $('#winningOption').fadeOut("fast");
        }, 1200);
    })





});

socket.on('register', function(data){
    id = data['id'];
    debuggerLog('My game id is ' + id);
    createQR();
});

socket.on('disconnect', function(){
    debuggerLog('Disconnected from the server....');
});


function sendFrame(question, options, time){

    socket.emit('frame', {"id":id,"question":question,"options": options, "time": time});

    startTimer(time);

    debuggerLog("Sent frame info to server");
}

function createQR(){
    $('#joinQR').attr('src','https://api.qrserver.com/v1/create-qr-code/?data=http://techwizmatt.info/projects/school/eng/game/client?id='+ id +'&size=220x220&margin=0');
}

function startTimer(time){

    var passTime = 0;
    var width = $('#timeLeft').width();

    var repeat = setInterval(function(){
        passTime++

        if(passTime >= time){
            clearInterval(repeat);

            setTimeout( function(){
                $( "#timeBar" ).animate({
                    width: width
                }, 100);
            }, 100);

        }

        var multi = (passTime / time - 1) * -1;
        var progress = multi * width;

        $( "#timeBar" ).animate({
            width: progress
        }, 900);

    }, 900);
}

function simulateKeyPress(character) {
    window.dispatchEvent(new KeyboardEvent('keydown',{'key':character}));
}