var textLog = "";
function downloadLog(){
    window.location = 'data:application/octet-stream;charset=utf-8;base64,' + btoa(textLog);
}
function clearLog(){
    $('#debugLog').empty();
    textLog = "";
}
function debuggerLog(string){
    console.log(string);

    var today = new Date();
    var stamp = "<p style='color:#1abc9c;float:left; display:inline;'>" + today.getHours()+':'+today.getMinutes()+':'+today.getSeconds() + "</p>";

    textLog = textLog + "" + today.getHours()+':'+today.getMinutes()+':'+today.getSeconds()+"> " + string + " \n";

    $('#debugLog').append("<span style='display: inline-block' >" + stamp + "<p style='color:#e67e22;float:left; display:inline;'>>&nbsp;</p><p style='color:#ecf0f1;float:left; display:inline;' > " + string + "</p></span><br>");
    $('#debugLog').animate({scrollTop:10000000}, 'fast');
}

function simulateKeyPress(character) {
    window.dispatchEvent(new KeyboardEvent('keydown',{'key':character}));
}