var serverId = getUrlParam('id', false);

if (serverId == false) {
    alert('ID is NULL');
    die('ID IS NULL');
}

var socket = io('http://techhost.co:235',{ query: "id=" + serverId }); 

socket.on('connect', function(){
    console.log('Connected to Multiplayer IO server.');
});

socket.on('frame', function(data){

    if (data['id'] == serverId) {
        console.log(data);
        $('#question').html("<h5>" + data['question'] + "</h5>");

        if (Object.keys(data['options']).length >= 2) {

            $('.buttons').show();

            if (data['options']['A'] == null) {
                $('#A').hide();
            } else {
                $('#A').fadeIn("slow");
            }
            if (data['options']['B'] == null) {
                $('#B').hide();
            } else {
                $('#B').fadeIn("slow");
            }
            if (data['options']['C'] == null) {
                $('#C').hide();
            } else {
                $('#C').fadeIn("slow");
            }
            if (data['options']['D'] == null) {
                $('#D').hide()
            } else {
                $('#D').fadeIn("slow");
            }

            startTimer(data['time']);

        } else {
            setTimeout(function(){
                $('#other').html('<p>The story is about to continue, One moment...</p>');
                $('#other').fadeIn("fast", function(){
                    setTimeout(function(){

                        $('#other').fadeOut("fast");
                    }, 7000);
                });
            }, 3000);
            socket.emit('option', {"option":"*"});
        }
    }
    
});

socket.on('disconnect', function(){
    console.log('Disconnected from the server....');
});

function getUrlParam(parameter, defaultvalue){
    var urlparameter = defaultvalue;
    if(window.location.href.indexOf(parameter) > -1){
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function sendOption(option){

    socket.emit('option', {"option":option});

    console.log('Sent option ' + option);

    $('.buttons').fadeOut("fast");
    $('#question').html("<h5> Option "+ option +" has been sent!</h5>");
}

function startTimer(time){

    //(2 / 10 - 1)  * -1 = 0.8

    //timeBar

    var passTime = 0;
    var width = $('#timeLeft').width();

    var repeat = setInterval(function(){
        passTime++

        if(passTime >= time){
            clearInterval(repeat);

            setTimeout( function(){

                $('.buttons').fadeOut("fast");

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